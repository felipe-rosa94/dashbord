import React from 'react'
import '../styles/categorias.css'
import {
    Box,
    CardContent,
    CardMedia,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormLabel,
    Button,
    Card,
    Dialog,
    DialogActions,
    TextField,
    CircularProgress
} from '@material-ui/core'
import {
    Cancel,
    ExpandLess,
    ExpandMore,
    Search
} from '@material-ui/icons'
import {
    createMuiTheme,
    MuiThemeProvider
} from '@material-ui/core/styles'
import {chave, cleanAccents} from '../util'
import MenuInferior from '../components/MenuInferior'
import Categoria from '../components/Categoria'
import firebase from 'firebase'

let usuario

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121'
        }
    },
})

class Categorias extends React.Component {

    state = {
        vizualizar: true,
        imageBase64: '',
        buscando: false,
        busca: '',
        categoria: '',
        categorias: [],
        dados: [],
        dialogImagem: false,
        dialogAviso: false,
        dialogCaterogia: false,
        dialogCarregando: false,
        mensagemCarregendo: ''
    }

    handleInput = e => this.setState({[e.target.name]: e.target.value})

    handleCategoria = async objeto => {
        let {acao, dados: {id, categoria, ativo, imagem, ordem}} = objeto
        const {dados} = this.state
        if (acao === 'ativo') {
            this.alterarCategoria({ativo: ativo}, id)
        } else if (acao === 'imagem') {
            this.setState({dialogImagem: true, imagemCategoria: imagem, tituloCategoria: categoria})
        } else if (acao === 'sobe') {
            if (ordem === 0) return
            let novaOrdem = (ordem - 1)
            await this.alterarCategoria({ordem: novaOrdem}, id)
            await this.alterarCategoria({ordem: ordem}, dados[novaOrdem].id)
        } else if (acao === 'desce') {
            if (ordem === (dados.length - 1)) return
            let novaOrdem = (ordem + 1)
            await this.alterarCategoria({ordem: novaOrdem}, id)
            await this.alterarCategoria({ordem: ordem}, dados[novaOrdem].id)
        } else if (acao === 'editar') {
            this.setState({
                id: id,
                vizualizar: true,
                editando: true,
                categoria: categoria,
                imagem: imagem
            })
        } else if (acao === 'deletar') {
            this.setState({
                busca: '',
                buscando: false,
                dialogCaterogia: true,
                id: id,
                categoriaDeletar: categoria
            })
        }
    }

    visualizar = () => {
        const {vizualizar} = this.state
        this.setState({vizualizar: !vizualizar})
    }

    onClickCancelaEdicao = () => this.setState({categoria: '', editando: false})

    cancelaDeletar = () => this.setState({dialogCaterogia: false, id: '', categoriaDeletar: ''})

    confirmaDeletar = () => this.deletarCategoria()

    cancelaImagem = () => this.setState({dialogImagem: false})

    cancelaAviso = () => this.setState({dialogAviso: false})

    onClickCancelaBusca = () => this.cancelaBusca()

    cancelaBusca = () => {
        const {dados} = this.state
        this.setState({busca: '', buscando: false, categorias: dados})
    }

    onClickBusca = () => this.busca()

    busca = () => {
        const {dados, busca} = this.state
        if (busca === '') return
        let array = []
        dados.forEach(i => {
            if (cleanAccents(i.categoria).includes(cleanAccents(busca))) array.push(i)
        })
        this.setState({buscando: true, categorias: array})
    }

    onClickAdicionar = () => {
        const {editando, imagem, imageBase64, categoria, id} = this.state
        if (editando) {
            let json = {id: id, categoria: categoria, imagem: imageBase64 !== '' ? imageBase64 : imagem}
            this.alterarCategoria(json, id)
            this.setState({categoria: '', editando: false, imagem: '', imageBase64: ''})
        } else {
            this.adicionar()
        }
    }

    deletarCategoria = () => {
        const {id} = this.state
        this.setState({
            dialogCaterogia: false, dialogCarregando: true, mensagemCarregendo: 'Aguarde, deletando categoria...'
        })
        firebase
            .database()
            .ref(`categorias/${usuario}/${id}`)
            .remove((complete) => {
                this.setState({dialogCarregando: false})
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
        this.consultarCategoria()
    }

    alterarCategoria = (json, id) => {
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde, alterando categoria...'})
        firebase
            .database()
            .ref(`categorias/${usuario}/${id}`)
            .update(json)
            .then((data) => {
                this.setState({dialogCarregando: false})
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
        this.consultarCategoria()
    }

    adicionar = () => {
        const {dados, categoria, imageBase64} = this.state
        if (!categoria) return this.setState({dialogAviso: true, mensagemAviso: 'Coloque o nome de categoria'})
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde, adicionando categoria...'})
        let ordem = dados.length
        let json = {id: chave(), categoria: categoria, imagem: imageBase64, ativo: true, ordem: ordem}
        firebase
            .database()
            .ref(`categorias/${usuario}/${json.id}`)
            .set(json)
            .then((data) => {
                this.setState({dialogCarregando: false, categoria: ''})
                this.consultarCategoria()
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
    }

    consultarCategoria = () => {
        firebase
            .database()
            .ref('categorias')
            .child(usuario)
            .on('value', (data) => {
                if (data.val() !== null) {
                    let dados = Object.values(data.val())
                    dados.sort((a, b) => {
                        if (b.ordem > a.ordem) return -1
                        if (b.ordem < a.ordem) return 1
                        return 0
                    })
                    this.setState({categorias: dados, dados: dados})
                } else {

                    this.setState({categorias: [], dados: []})
                }
            })
    }

    componentDidMount() {
        usuario = sessionStorage.getItem(`gp:usuario`)
        this.consultarCategoria()
    }

    render() {
        const {
            categoria,
            categorias,
            buscando,
            busca,
            dialogCaterogia,
            categoriaDeletar,
            dialogAviso,
            mensagemAviso,
            dialogImagem,
            imagemCategoria,
            tituloCategoria,
            vizualizar,
            editando,
            dialogCarregando,
            mensagemCarregendo
        } = this.state
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <div id="categorias">
                        <section id="section-body-categorias">
                            <div id="div-menu-categorias">
                                <Card id="card-categorias">
                                    <CardContent id="card-content-categorias-busca">
                                        <TextField variant="outlined" fullWidth={true} placeholder="Buscar categorias"
                                                   value={busca} name="busca" onChange={this.handleInput}/>
                                        <Box p={1}/>
                                        {buscando && <Cancel id="icone" onClick={this.onClickCancelaBusca}/>}
                                        <Search id="icone" onClick={this.onClickBusca}/>
                                    </CardContent>
                                </Card>
                                {
                                    vizualizar &&
                                    <Card id="card-categorias">
                                        <CardContent id="card-content-categorias">
                                            <div id="div-formulario-inputs-categoria">
                                                <div id="div-inputs-categorias">
                                                    <TextField variant="outlined" fullWidth={true}
                                                               placeholder="Categoria"
                                                               value={categoria} name="categoria"
                                                               onChange={this.handleInput}/>
                                                </div>
                                            </div>
                                            <div id="div-botao-salvar-categorias">
                                                <Button variant="outlined"
                                                        onClick={this.onClickAdicionar}>Salvar</Button>
                                                {editando && <Box p={1}/>}
                                                {
                                                    editando &&
                                                    <Button variant="outlined" onClick={this.onClickCancelaEdicao}>
                                                        Cancelar
                                                    </Button>
                                                }
                                            </div>
                                        </CardContent>
                                    </Card>
                                }
                                <div id="div-vizualizar-cadastro" onClick={this.visualizar}>
                                    <div id="div-botao-vizualizar">
                                        <FormLabel
                                            id="label-vizualizar">{!vizualizar ? 'Maximizar' : 'Minimizar'}</FormLabel>
                                        {!vizualizar ? <ExpandMore/> : <ExpandLess/>}
                                    </div>
                                </div>
                            </div>
                            <div id="div-categorias">
                                {
                                    categorias.map((i, index) => (
                                        <Categoria key={index} data={i}
                                                   handleChange={this.handleCategoria.bind(this)}/>))
                                }
                            </div>
                        </section>
                    </div>
                    <MenuInferior pagina="categorias"/>
                    <Dialog open={dialogCaterogia} onClose={this.cancelaDeletar}>
                        <DialogTitle>Deletar</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{`Deseja deletar a categoria ${categoriaDeletar} ?`}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.confirmaDeletar}>Sim</Button>
                            <Button color="primary" onClick={this.cancelaDeletar}>Não</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={dialogImagem} onClose={this.cancelaImagem}>
                        <DialogTitle>{tituloCategoria}</DialogTitle>
                        <DialogContent id="card-content-imagem">
                            <CardMedia id="card-image" image={imagemCategoria}/>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={dialogCarregando}>
                        <DialogContent id="dialog-carregando">
                            <CircularProgress size={30}/>
                            <DialogContentText id="label-carregando">{mensagemCarregendo}</DialogContentText>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={dialogAviso} onClose={this.cancelaAviso}>
                        <DialogTitle>Aviso</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{mensagemAviso}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" color="primary" onClick={this.cancelaAviso}>Fechar</Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default Categorias
