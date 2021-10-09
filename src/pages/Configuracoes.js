import React from 'react'
import '../styles/configuracoes.css'
import {AppBar, Tab, Tabs} from '@material-ui/core'
import MenuInferior from '../components/MenuInferior'
import Site from './Site'

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

class Configuracoes extends React.Component {

    state = {
        tabIndex: 0
    }

    handleTabs = (event, newValue) => {
        this.setState({tabIndex: newValue})
    }

    render() {
        const {tabIndex} = this.state
        return (
            <MuiThemeProvider theme={theme}>
                <div id="configuracoes">
                    <AppBar position="sticky">
                        <Tabs indicatorColor="primary"
                              variant="fullWidth"
                              value={tabIndex}
                              onChange={this.handleTabs}
                              aria-label="simple tabs example">
                            <Tab label="Site"/>

                        </Tabs>
                    </AppBar>
                    {(() => {
                        if (tabIndex === 0) {
                            return (<Site/>)
                        }
                    })()}
                    <MenuInferior pagina="configuracoes"/>
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Configuracoes
