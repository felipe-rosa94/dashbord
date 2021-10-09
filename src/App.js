import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import Categorias from './pages/Categorias'
import Produtos from './pages/HomeProdutos'
import Configuracoes from './pages/Configuracoes'

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Login}/>
                <Route exact path="/pedidos" component={Pedidos}/>
                <Route exact path="/categorias" component={Categorias}/>
                <Route exact path="/produtos" component={Produtos}/>
                <Route exact path="/configuracoes" component={Configuracoes}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App
