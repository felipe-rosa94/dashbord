import React from 'react'
import '../styles/pedidos.css'
import MenuInferior from '../components/MenuInferior'
import Pedido from '../components/Pedido'
import {idPedido} from '../util'
import firebase from '../firebase'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MuiThemeProvider
} from '@material-ui/core'
import {createMuiTheme} from "@material-ui/core/styles"

const URL_SOM = 'https://firebasestorage.googleapis.com/v0/b/while-dev.appspot.com/o/som%2Faviso.mp3?alt=media&token=6f02adf1-1ae3-4cab-831f-6b49dbd438ae'

let usuario

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121'
        }
    },
})

class Pedidos extends React.Component {

    state = {
        pedidos: [],
        dialogPedido: false
    }

    handlePedido = objeto => {
        this.setState({
            pedido: objeto.pedido,
            status: objeto.status,
            dialogPedido: true,
            id_pedido: idPedido(objeto.pedido.id_pedido)
        })
    }

    confirmaEntragaPedido = () => {
        const {pedido, status} = this.state
        this.setState({dialogPedido: false})
        this.alterarStatusPedidos(pedido, status)
    }

    cancelaEntragaPedido = () => this.setState({dialogPedido: false, id_pedido: ''})

    consultarPedidos = () => {
        firebase
            .database()
            .ref('pedidos')
            .child(usuario)
            .on('value', async data => {
                if (data.val() !== null)
                    await this.gravaPedido(Object.values(data.val()))
                else
                    this.setState({pedidos: []})
            })
    }

    gravaPedido = async pedidos => {
        pedidos.sort((a, b) => {
            if (a.data > b.data) return -1
            if (a.data < b.data) return 1
            return 0
        })
        this.setState({pedidos: pedidos})
        for (let i = 0; i < pedidos.length; i++) {
            if (pedidos[i].status === 'ENVIADO') {
                this.play()
                this.alterarStatusPedidos(pedidos[i], 'RECEBIDO')
                break
            }
        }
    }

    play = () => {
        let audio = new Audio(URL_SOM)
        audio.play().then(r => console.log(r))
    }

    alterarStatusPedidos = (pedido, status) => {
        firebase
            .database()
            .ref(`pedidos/${usuario}/${pedido.id_pedido}`)
            .update({status: status})
            .then((data) => {

            })
            .catch((e) => {
                console.error(e)
            })
    }

    componentDidMount() {
        usuario = sessionStorage.getItem(`gp:usuario`)
        this.consultarPedidos()
    }

    render() {
        const {pedidos, dialogPedido, id_pedido} = this.state
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <section id="section-body">
                        <section id="section-body-pedidos">
                            {
                                // eslint-disable-next-line array-callback-return
                                pedidos.map((i, index) => {
                                    if (i.status === 'ENVIADO' || i.status === 'RECEBIDO' || i.status === 'CONFIRMADO')
                                        return (
                                            <Pedido key={index} data={i} handleChange={this.handlePedido.bind(this)}/>)
                                })
                            }
                        </section>
                        <MenuInferior pagina="pedidos"/>
                    </section>
                    <Dialog open={dialogPedido} onClose={this.cancelaEntragaPedido}>
                        <DialogTitle>Deletar</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{`Confirma troca de status do pedido ${id_pedido} ?`}</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={this.cancelaEntragaPedido}>Não</Button>
                            <Button color="primary" onClick={this.confirmaEntragaPedido}>Sim</Button>
                        </DialogActions>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }
}

export default Pedidos
