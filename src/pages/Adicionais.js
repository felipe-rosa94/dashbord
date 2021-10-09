import React from 'react'
import '../styles/adicionais.css'
import {
    RadioGroup,
    Radio,
    FormControlLabel,
    TextField,
    Button,
    FormLabel,
    DialogTitle,
    DialogContent,
    Dialog,
    Card,
    CardContent, DialogContentText, DialogActions, Box, Switch, CircularProgress
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {chave, cleanAccents} from '../util'
import {Edit, Delete, Cancel, Search, ExpandMore, ExpandLess} from '@material-ui/icons'
import {
    createMuiTheme,
    MuiThemeProvider
} from '@material-ui/core/styles'
import firebase from 'firebase'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121'
        }
    },
})

let usuario

const RadioButton = withStyles({
    checked: {},
})(props => <Radio color="default" {...props} />)


class Adicionais extends React.Component {

    state = {
        vizualizar: true,
        dados: [],
        tipo: '',
        adicionais: [],
        itens: [],
        exibirValores: false,
        dialogDeletar: false,
        dialogAviso: false,
        dialogAdicionais: false,
        dialogCarregando: false,
        mensagemCarregendo: '',
        tituloAdicional: '',
        dialogTituloAdicionais: '',
        adicional: '',
        valor: '',
        busca: ''
    }

    handleInput = e => this.setState({[e.target.name]: e.target.value})

    visualizar = () => {
        const {vizualizar} = this.state
        this.setState({vizualizar: !vizualizar})
    }

    onRadio = e => this.setState({tipo: e.target.value})

    onClickBusca = () => this.busca()

    busca = () => {
        const {dados, busca} = this.state
        if (busca === '') return
        let array = []
        dados.forEach(i => {
            let superBusca = `${i.tituloAdicional}${i.tipo}`
            if (cleanAccents(superBusca).includes(cleanAccents(busca))) array.push(i)
        })
        this.setState({buscando: true, adicionais: array})
    }

    onClickCancelaBusca = () => this.cancelaBusca()

    cancelaBusca = () => {
        const {dados} = this.state
        this.setState({busca: '', buscando: false, adicionais: dados})
    }

    cancelaDeletar = () => this.setState({dialogDeletar: false, id: ''})

    cancelaAviso = () => this.setState({dialogAviso: false})

    onClickValores = e => this.setState({exibirValores: e.target.checked})

    onClickAdicionar = () => this.adicionar()

    onClickAdicional = () => this.adicional()

    adicional = () => {
        const {id, itens, adicional, valor} = this.state
        let json = {adicional: adicional, valor: valor !== '' ? parseFloat(valor) : 0}
        itens.push(json)
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde...'})
        firebase
            .database()
            .ref(`adicionais/${usuario}/${id}`)
            .update({itens: itens})
            .then((data) => {
                this.setState({dialogCarregando: false, adicional: '', valor: ''})
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
    }

    onClickAdicionarItens = i => {
        this.setState({
            dialogAdicionais: true,
            dialogTituloAdicionais: i.tituloAdicional,
            itens: i.itens !== undefined ? i.itens : [],
            id: i.id
        })
    }

    onClickDeletar = objeto => {
        this.setState({dialogDeletar: true, id: objeto.id, adicionalDeletar: objeto.tituloAdicional})
    }

    deletarAdicional = () => {
        const {id} = this.state
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde...'})
        firebase
            .database()
            .ref(`adicionais/${usuario}/${id}`)
            .remove((complete) => {
                this.setState({dialogCarregando: false, dialogDeletar: false})
            })
            .catch((e) => {
                this.setState({dialogCarregando: false, dialogDeletar: false, dialogAviso: true, mensagemAviso: e})
            })
    }

    onClickDeletaItem = (itens, index) => {
        const {id} = this.state
        itens.splice(index, 1)
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde...'})
        firebase
            .database()
            .ref(`adicionais/${usuario}/${id}`)
            .update({itens: itens})
            .then((data) => {
                this.setState({dialogCarregando: false, adicional: '', valor: ''})
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
    }

    cancelaAdicionais = () => this.setState({dialogAdicionais: false})

    adicionar = async () => {
        const {tituloAdicional, tipo, exibirValores} = this.state
        if (tituloAdicional === '') return this.setState({
            dialogAviso: true,
            mensagemAviso: 'Coloque um nome no adicional'
        })
        if (tipo === '') return this.setState({
            dialogAviso: true,
            mensagemAviso: 'Escolha um tipo exemplo: "Observações"'
        })
        let json = {
            exibirValores: exibirValores,
            tituloAdicional: tituloAdicional,
            tipo: tipo,
            itens: [],
            id: chave()
        }
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde...'})
        firebase
            .database()
            .ref(`adicionais/${usuario}/${json.id}`)
            .set(json)
            .then((data) => {
                this.setState({dialogCarregando: false})
            })
            .catch((e) => {
                this.setState({dialogAviso: true, mensagemAviso: e})
            })
        this.setState({tipo: '', tituloAdicional: '', exibirValores: false})
    }

    consultaAdicionais = () => {
        this.setState({dialogCarregando: true, mensagemCarregendo: 'Aguarde...'})
        firebase
            .database()
            .ref('adicionais')
            .child(usuario)
            .on('value', (data) => {
                let dados = data.val()
                if (dados !== null) {
                    dados = Object.values(dados)
                    this.setState({dialogCarregando: false, adicionais: dados, dados: dados})
                } else {
                    this.setState({dialogCarregando: false, adicionais: [], dados: []})
                }
            })
    }

    componentDidMount() {
        usuario = localStorage.getItem(`gp:tabela`)
        this.consultaAdicionais()
    }

    render() {
        const {
            vizualizar,
            dialogDeletar,
            dialogAdicionais,
            dialogAviso,
            mensagemAviso,
            adicionais,
            itens,
            adicionalDeletar,
            tipo,
            tituloAdicional,
            exibirValores,
            dialogTituloAdicionais,
            adicional,
            valor,
            busca,
            buscando,
            dialogCarregando,
            mensagemCarregendo
        } = this.state
        return (
            <MuiThemeProvider theme={theme}>
                <div>
                    <div id="adicionais">
                        <div id="section-body-adicionais">
                            <div>
                                <Card id="card-produtos">
                                    <CardContent id="card-content-adicionais-busca">
                                        <TextField variant="outlined" fullWidth={true} placeholder="Buscar adicional"
                                                   value={busca} name="busca" onChange={this.handleInput}/>
                                        <Box p={1}/>
                                        {buscando && <Cancel id="icone" onClick={this.onClickCancelaBusca}/>}
                                        <Search id="icone" onClick={this.onClickBusca}/>
                                    </CardContent>
                                </Card>
                                {
                                    vizualizar &&
                                    <Card id="card-produtos">
                                        <CardContent id="card-content-adicionais">
                                            <div id="div-formulario-inputs-adicionais">
                                                <div id="div-cadastro-etapas">
                                                    <TextField value={tituloAdicional} variant="outlined"
                                                               fullWidth={true}
                                                               placeholder="Nome adicional"
                                                               name="tituloAdicional"
                                                               onChange={this.handleInput}/>
                                                </div>
                                                <div id="div-cadastro-etapas">
                                                    <FormControlLabel checked={exibirValores} label="Exibi valores"
                                                                      control={<Switch color="primary"
                                                                                       onChange={(e) => this.onClickValores(e)}/>}
                                                    />
                                                    <RadioGroup id="radio-group-adicionais">
                                                        <FormControlLabel checked={tipo === '0'} value="0"
                                                                          control={<RadioButton color="primary"/>}
                                                                          label="Adicionais"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel checked={tipo === '1'} value="1"
                                                                          control={<RadioButton color="primary"/>}
                                                                          label="Observações"
                                                                          onChange={this.onRadio}/>
                                                        <FormControlLabel checked={tipo === '2'} value="2"
                                                                          control={<RadioButton color="primary"/>}
                                                                          label="Opcionais"
                                                                          onChange={this.onRadio} color="primary"/>
                                                    </RadioGroup>
                                                </div>
                                                <div id="div-botao-salvar-adicionais">
                                                    <Button variant="outlined"
                                                            onClick={this.onClickAdicionar}>Salvar</Button>
                                                </div>
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
                            <div>
                                {
                                    adicionais.map((i, index) => (
                                        <Card key={index} id="card-produtos">
                                            <CardContent id="card-content-adicionais">
                                                <div id="div-grupo-adicionais">
                                                    <FormLabel id="nome-adicional">{i.tituloAdicional}</FormLabel>
                                                    <div>
                                                        <Edit id="icone" onClick={() => this.onClickAdicionarItens(i)}/>
                                                        <Delete id="icone" onClick={() => this.onClickDeletar(i)}/>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <Dialog open={dialogAdicionais} onClose={this.cancelaAdicionais}>
                        <DialogTitle>{dialogTituloAdicionais}</DialogTitle>
                        <DialogContent id="card-content-dialog-adicionais">
                            <div id="div-dialog-adicionais">
                                <TextField variant="outlined" value={adicional} fullWidth={true} placeholder="Adicional"
                                           name="adicional"
                                           onChange={this.handleInput}/>
                                <Box p={1}/>
                                <TextField variant="outlined" value={valor} fullWidth={true} placeholder="Valor"
                                           name="valor" type="number"
                                           onChange={this.handleInput}/>
                                <Box p={1}/>
                                <Button variant="outlined" onClick={this.onClickAdicional}>Salvar</Button>
                            </div>
                            {
                                itens.map((i, index) => (
                                    <Card id="card-adicionais">
                                        <CardContent id="card-content-dialog-itens-adicional">
                                            <div id="div-nome-valor-item-adicional">
                                                <FormLabel id="nome-adicional">{i.adicional}</FormLabel>
                                                <FormLabel id="valor-adicional">
                                                    {
                                                        i.valor !== 0 &&
                                                        parseFloat(i.valor).toLocaleString('pt-BR', {
                                                            style: 'currency',
                                                            currency: 'BRL'
                                                        })
                                                    }
                                                </FormLabel>
                                            </div>
                                            <div>
                                                <Delete id="icone"
                                                        onClick={() => this.onClickDeletaItem(itens, index)}/>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button variant="outlined" color="primary" onClick={this.cancelaAdicionais}>Fechar</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={dialogDeletar} onClose={this.cancelaDeletar}>
                        <DialogTitle>Deletar</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{`Deseja deletar a produto ${adicionalDeletar} ?`}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.deletarAdicional}>Sim</Button>
                            <Button color="primary" onClick={this.cancelaDeletar}>Não</Button>
                        </DialogActions>
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
                    <Dialog open={dialogCarregando}>
                        <DialogContent id="dialog-carregando">
                            <CircularProgress size={30}/>
                            <DialogContentText id="label-carregando">{mensagemCarregendo}</DialogContentText>
                        </DialogContent>
                    </Dialog>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Adicionais