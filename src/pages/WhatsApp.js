import React from 'react'
import '../styles/whatsapp.css'
import {
    Box,
    Button,
    CardMedia,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    Switch,
    TextField
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'
import {cleanPhone, phoneMask, request} from '../util'

const {REACT_APP_URL_MONGODB} = process.env
let tabela

const RadioButton = withStyles({
    root: {
        color: '#000000',
        '&$checked': {
            color: '#000000',
        },
    },
    checked: {},
})(props => <Radio color="default" {...props} />)

class WhatsApp extends React.Component {

    state = {
        _id: '',
        intervalo: '0',
        boasVindas: '',
        agradecimento: '',
        whatsApp: '',
        email: '',
        ativo: true,
        dialogAviso: false,
        mensagemAviso: '',
        qrcode: ''
    }

    handleInput = e => this.setState({[e.target.name]: (e.target.name === 'whatsApp') ? phoneMask(e.target.value) : e.target.value})

    onClickAtivo = e => this.setState({ativo: e.target.checked})

    onClickRadio = e => this.setState({intervalo: e.target.value})

    cancelaAviso = () => this.setState({dialogAviso: false})

    salvarAlteracoes = async () => {
        try {
            const {_id, intervalo, ignorar, boasVindas, agradecimento, whatsApp, email, ativo} = this.state

            if (!boasVindas) return this.setState({
                dialogAviso: true,
                mensagemAviso: 'Adicione uma mensagem de boas vindas'
            })
            if (!agradecimento) return this.setState({
                dialogAviso: true,
                mensagemAviso: 'Adicione uma mensagem de agradecimento'
            })

            if (!whatsApp && (cleanPhone(whatsApp).length >= 10)) return this.setState({
                dialogAviso: true,
                mensagemAviso: 'Adicione um número que recebera as notificações'
            })

            let ignorados = ignorar.split(',')

            let json = {
                intervalo: intervalo,
                boasVindas: boasVindas,
                agradecimento: agradecimento,
                whatsApp: cleanPhone(whatsApp),
                ignorados: ignorados,
                email: email,
                ativo: ativo
            }

            let url
            let conexao
            if (_id) {
                url = `${REACT_APP_URL_MONGODB}/whatsApp-${tabela}/?id=${_id}`
                conexao = {method: 'put', body: JSON.stringify(json)}
            } else {
                url = `${REACT_APP_URL_MONGODB}/whatsApp-${tabela}`
                conexao = {method: 'post', body: JSON.stringify(json)}
            }
            const {message} = await request(url, conexao)
            this.setState({dialogAviso: true, mensagemAviso: message})

        } catch (e) {
            console.log(e.message)
        }
    }

    consultarConfiguracoes = async () => {
        try {
            if (tabela === null) return
            let url = `${REACT_APP_URL_MONGODB}/whatsApp-${tabela}`
            const conexao = {method: 'get'}
            const {returnCode, message, data} = await request(url, conexao)
            if (!returnCode) return this.setState({dialogAviso: true, mensagemAviso: message})
            const {_id, intervalo, ignorados, boasVindas, agradecimento, whatsApp, email, ativo} = data[0]
            this.setState({
                _id: _id,
                intervalo: intervalo,
                boasVindas: boasVindas,
                ignorar: ignorados.toString(),
                agradecimento: agradecimento,
                whatsApp: phoneMask(whatsApp),
                email: email,
                ativo: ativo
            })
            document.getElementById('input-boas-vindas').value = boasVindas
            document.getElementById('input-agradecimento').value = agradecimento
            document.getElementById('input-ignorar').value = ignorados.toString()
        } catch (e) {
            console.log(e.message)
        }
    }

    consultaQrCode = () => {
        setInterval(async () => {
            let usuario = sessionStorage.getItem(`gp:usuario`)
            let senha = sessionStorage.getItem(`gp:senha`)
            const url = `${REACT_APP_URL_MONGODB}/usuarios/?user=${usuario}&password=${senha}`
            const conexao = {method: 'get'}
            const {returnCode, data, message} = await request(url, conexao)
            if (!returnCode) return alert(message)
            if (data.length === 0) return alert('Usuário ou senha incorretos')
            const {qrcode} = data[0]
            this.setState({qrcode: qrcode})
        }, 1000)
    }

    componentDidMount() {
        tabela = localStorage.getItem(`gp:tabela`)
        //this.consultarConfiguracoes()
        //this.consultaQrCode()
    }

    render() {
        const {intervalo, whatsApp, email, ativo, dialogAviso, mensagemAviso, qrcode} = this.state
        return (
            <div>
                <div id="whatsapp">
                    <section id="section-body-whatsapp">
                        <div id="div-menu-whatsapp">
                            <div id="div-whatsapp-esquerdo">
                                <TextField variant="outlined" fullWidth={true} multiline={true}
                                           placeholder="Mensagem de boas vindas" id="input-boas-vindas"
                                           name="boasVindas" onChange={this.handleInput}/>
                                <Box p={1}/>
                                <TextField variant="outlined" fullWidth={true} multiline={true}
                                           placeholder="Mensagem de agradecimento" id="input-agradecimento"
                                           name="agradecimento" onChange={this.handleInput}/>
                            </div>
                            <Box p={1}/>
                            <div id="div-whatsapp-direito">
                                <TextField variant="outlined" fullWidth={true}
                                           placeholder="WhatsApp para notificações" id="input-telfone" name="whatsApp"
                                           value={whatsApp}
                                           onChange={this.handleInput}/>
                                <Box p={1}/>
                                <TextField variant="outlined" fullWidth={true} placeholder="E-mail (Opcional)"
                                           id="input-email" name="email" value={email} onChange={this.handleInput}/>
                            </div>
                        </div>
                        <div id="div-menu-whatsapp">
                            <div id="div-whatsapp-esquerdo">
                                <FormLabel>
                                    Defina um intervalo de tempo que mensagem pessoais não receberam a resposta
                                    automatima
                                </FormLabel>
                                <RadioGroup id="radio-group">
                                    <FormControlLabel value="0" label="Nenhum" checked={intervalo === '0'}
                                                      control={<RadioButton/>} onChange={(e) => this.onClickRadio(e)}/>
                                    <FormControlLabel value="5" label="5 Minutos" checked={intervalo === '5'}
                                                      control={<RadioButton/>} onChange={(e) => this.onClickRadio(e)}/>
                                    <FormControlLabel value="15" label="15 Minutos" checked={intervalo === '15'}
                                                      control={<RadioButton/>} onChange={(e) => this.onClickRadio(e)}/>
                                </RadioGroup>
                            </div>
                            <Box p={1}/>
                            <div id="div-whatsapp-direito">
                                <TextField variant="outlined" fullWidth={true} multiline={true}
                                           placeholder="Ignorados" id="input-ignorar"
                                           name="ignorar" onChange={this.handleInput}/>
                            </div>
                        </div>
                        <div id="div-menu-whatsapp">
                            <div id="div-whatsapp-esquerdo">
                                <FormLabel>Defina a ativação ou desativação das mensagens</FormLabel>
                                <FormControlLabel
                                    control={<Switch checked={ativo} label={ativo ? 'Ativada' : 'Desativada'}
                                                     onChange={(e) => this.onClickAtivo(e)}/>}
                                />
                            </div>
                        </div>
                        <div id="div-menu-whatsapp">
                            <div id="div-botao-salvar-whatsapp">
                                <Button variant="outlined" onClick={this.salvarAlteracoes}>Salvar alterações</Button>
                            </div>
                        </div>
                        <div id="div-menu-whatsapp">
                            <div id="div-whatsapp-centro">
                                <FormLabel>Qr Code de conexão</FormLabel>
                                <CardMedia id="qrcode" image={qrcode}/>
                            </div>
                        </div>
                    </section>
                </div>
                <Dialog open={dialogAviso} onClose={this.cancelaAviso}>
                    <DialogTitle>Aviso</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{mensagemAviso}</DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default WhatsApp