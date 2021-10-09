import React from 'react'
import '../styles/produto.css'
import {
    Card,
    CardContent,
    FormControlLabel,
    FormLabel,
    Switch
} from '@material-ui/core'
import {
    ArrowDownward,
    ArrowUpward,
    Delete,
    Edit
} from '@material-ui/icons'
import {
    createMuiTheme,
    MuiThemeProvider
} from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#212121'
        }
    },
})

class Produto extends React.Component {

    onClick = (acao, objeto, e = null) => {
        if (e) {
            objeto.ativo = e.target.checked
            this.props.handleChange({acao: acao, dados: objeto})
        } else {
            this.props.handleChange({acao: acao, dados: objeto})
        }
    }

    render() {
        const {produto, categoria, descricao, preco, ativo, imagem, codigo} = this.props.data
        return (
            <MuiThemeProvider theme={theme}>
                <Card id="card-produto">
                    <CardContent id="card-content-produto">
                        <div id="div-produto">
                            <FormLabel
                                id="label-produto">{codigo !== '' ? `${codigo} - ${produto}` : `${produto}`}</FormLabel>
                            {categoria && <FormLabel id="label-descricao">{categoria}</FormLabel>}
                            {descricao && <FormLabel id="label-descricao">{descricao}</FormLabel>}
                            <FormLabel id="label-preco">
                                {parseFloat(preco).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                            </FormLabel>
                        </div>
                        <div id="div-acoes-produto">
                            {
                                imagem &&
                                <FormLabel id="label-imagem"
                                           onClick={() => this.onClick('imagem', this.props.data)}>
                                    Imagem
                                </FormLabel>
                            }
                            <FormControlLabel color="primary"
                                              control={<Switch checked={ativo} color="primary"
                                                               onChange={(e) => this.onClick('ativo', this.props.data, e)}/>}
                                              label={ativo ? 'Produto ativada' : 'Produto desativada'}
                            />
                            <Edit id="icone" onClick={() => this.onClick('editar', this.props.data)}/>
                            <Delete id="icone" onClick={() => this.onClick('deletar', this.props.data)}/>
                            <ArrowUpward id="icone" onClick={() => this.onClick('sobe', this.props.data)}/>
                            <ArrowDownward id="icone" onClick={() => this.onClick('desce', this.props.data)}/>
                        </div>
                    </CardContent>
                </Card>
            </MuiThemeProvider>
        )
    }
}

export default Produto
