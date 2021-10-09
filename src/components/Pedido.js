import React from 'react'
import '../styles/pedido.css'
import {Button, Card, CardContent, Divider, FormLabel} from '@material-ui/core'

import {idPedido} from '../util'

class Pedido extends React.Component {

    onClick = objeto => {
        if (objeto.acao === 'status') {
            let status = (objeto.pedido.cliente.endereco.retirar !== undefined) ? 'PRONTO' : 'ENTREGANDO'
            this.props.handleChange({pedido: objeto.pedido, status: status})
        } else if (objeto.acao === 'cancelar') {
            this.props.handleChange({pedido: objeto.pedido, status: 'CANCELADO'})
        } else if (objeto.acao === 'confirmar') {
            this.props.handleChange({pedido: objeto.pedido, status: 'RECEBIDO'})
        }
    }

    dataFormatada = data => {
        let date = new Date(data)
        let dia = date.getDate().toString()
        dia = dia.length === 1 ? `0${dia}` : dia
        let mes = date.getMonth().toString()
        mes = mes.length === 1 ? `0${mes}` : mes
        let hora = date.getHours().toString()
        hora = hora.length === 1 ? `0${hora}` : hora
        let minuto = date.getMinutes().toString()
        minuto = minuto.length === 1 ? `0${minuto}` : minuto
        return `${dia}/${mes} ${hora}:${minuto}`
    }

    render() {
        const {
            cliente: {
                nome,
                telefone,
                endereco: {
                    retirar,
                    logradouro,
                    numero,
                    bairro,
                    localidade,
                    complemento
                }
            },
            pagamento: {
                pagamento,
                taxaEntrega,
                subtotal,
                total,
                troco
            },
            itens,
            data,
            id_pedido,
            status
        } = this.props.data
        return (
            <div>
                <Card id="card-pedido">
                    <CardContent id="card-content-pedido">
                        <div id="div-data-id">
                            <FormLabel id="data-pedido">{`Data: ${this.dataFormatada(data)}`}</FormLabel>
                            <FormLabel id="id-pedido">{`Pedido: ${idPedido(id_pedido)}`}</FormLabel>
                        </div>
                        <FormLabel id="nome-pedido">{`Nome: ${nome}`}</FormLabel>
                        <FormLabel id="telefone-pedido">{`Telefone: ${telefone}`}</FormLabel>
                        <Divider id="divider"/>
                        {
                            (retirar !== undefined) ?
                                <FormLabel id="endereco-pedido">{`Endereço: ${retirar}`}</FormLabel>
                                :
                                <FormLabel
                                    id="endereco-pedido">{`Endereço: ${logradouro}, ${numero} - ${bairro}, ${localidade} ${complemento}`}</FormLabel>
                        }
                        <Divider id="divider"/>
                        {
                            itens.map((i, index) => (
                                <div key={index}>
                                    <FormLabel
                                        id="produto-pedido">{`${i.quantidade}x ${`${i.codigo} - ${i.produto}`}`}</FormLabel>
                                    <FormLabel id="observacao-pedido">{i.observacao}</FormLabel>
                                    {
                                        (i.subitens !== undefined) &&
                                        <div id="div-subitens">
                                            {
                                                i.subitens.map((si, index) => (
                                                    <div key={index}>
                                                        <FormLabel
                                                            id="nome-subitens">{`${si.quantidade}x ${si.adicional}`}</FormLabel>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                            ))
                        }
                        <Divider id="divider"/>
                        <FormLabel id="pagamento-pedido">{`Tipo de pagamento: ${pagamento.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}`}</FormLabel>
                        {(taxaEntrega !== 0) &&
                        <FormLabel id="taxa-pedido">{`Taxa de entrega: ${taxaEntrega.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}`}</FormLabel>}
                        <FormLabel id="subtotal-pedido">{`SubTotal: ${subtotal.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}`}</FormLabel>
                        {
                            (troco !== undefined) &&
                            <FormLabel id="troco-pedido">{`Troco: ${troco.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                            })}`}</FormLabel>
                        }
                        <FormLabel id="total-pedido">{`Total: ${total.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        })}`}</FormLabel>
                    </CardContent>
                    <CardContent id="card-content-pedido">
                        <Button variant="outlined" fullWidth={true}
                                onClick={() => this.onClick({
                                    acao: (status === 'ENVIADO') ? 'confirmar' : 'status',
                                    pedido: this.props.data
                                })}>
                            {status === 'ENVIADO' ? 'Confirmar recebimento' : 'Pedido pronto'}
                        </Button>
                    </CardContent>
                    <CardContent id="card-content-pedido">
                        <Button variant="outlined" fullWidth={true}
                                onClick={() => this.onClick({acao: 'cancelar', pedido: this.props.data})}>
                            Cancelar pedido
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Pedido

