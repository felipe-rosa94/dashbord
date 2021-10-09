import React from 'react'
import '../styles/categoria.css'
import {Card, CardContent, FormControlLabel, FormLabel, Switch} from '@material-ui/core'
import {Delete, ArrowUpward, ArrowDownward, Edit} from '@material-ui/icons'

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

class Categoria extends React.Component {

    onClick = (acao, objeto, e = null) => {
        if (e) {
            objeto.ativo = e.target.checked
            this.props.handleChange({acao: acao, dados: objeto})
        } else {
            this.props.handleChange({acao: acao, dados: objeto})
        }
    }

    render() {
        const {categoria, ativo, imagem} = this.props.data
        return (
            <MuiThemeProvider theme={theme}>
                <Card id="card-categoria">
                    <CardContent id="card-content-categoria">
                        <FormLabel id="label-categoria">{categoria}</FormLabel>
                        <div id="div-acoes-categoria">
                            {
                                imagem &&
                                <FormLabel id="label-imagem"
                                           onClick={() => this.onClick('imagem', this.props.data)}>
                                    Imagem
                                </FormLabel>
                            }
                            <FormControlLabel
                                control={<Switch checked={ativo} color="primary"
                                                 onChange={(e) => this.onClick('ativo', this.props.data, e)}/>}
                                label={ativo ? 'Ativo' : 'Desativado'}
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

export default Categoria
