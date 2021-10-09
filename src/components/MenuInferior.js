import React from 'react'
import {withRouter} from 'react-router-dom'
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core'
import {HomeRounded, CategoryRounded, AddCircleOutline, SettingsRounded} from '@material-ui/icons'
import '../styles/menuInferior.css'

class MenuInferior extends React.Component {

    handleChange = (event, index) => {
        let pagina = this.props.history
        switch (index) {
            case 0:
                pagina.push('/pedidos')
                break
            case 1:
                pagina.push('/produtos')
                break
            case 2:
                pagina.push('/configuracoes')
                break
            default:
                break
        }
    }

    render() {
        let {pagina} = this.props
        return (
            <div>
                <BottomNavigation id="menu-footer" showLabels={true} onChange={this.handleChange}>
                    <BottomNavigationAction
                        label="Pedidos" style={pagina === 'pedidos' ? {color: '#8cc643'} : {color: 'white'}}
                        icon={<HomeRounded id="icons"
                                           style={pagina === 'pedidos' ? {color: '#8cc643'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Produtos"
                        style={pagina === 'produtos' ? {color: '#8cc643'} : {color: 'white'}}
                        icon={<AddCircleOutline id="icons"
                                                style={pagina === 'produtos' ? {color: '#8cc643'} : {color: 'white'}}/>}/>
                    <BottomNavigationAction
                        label="Configurações"
                        style={pagina === 'configuracoes' ? {color: '#8cc643'} : {color: 'white'}}
                        icon={<SettingsRounded id="icons"
                                               style={pagina === 'configuracoes' ? {color: '#8cc643'} : {color: 'white'}}/>}/>
                </BottomNavigation>
            </div>
        )
    }
}

export default withRouter(MenuInferior)
