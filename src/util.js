const request = async (url, conexao) => {
    return await fetch(url, conexao).then((data) => data.json()).catch((error) => (error))
}

const cleanAccents = text => {
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    text = text.toLowerCase()
    text = text.trim()
    return text
}

const cleanPhone = text => {
    text = text.replace('(', '')
    text = text.replace(')', '')
    text = text.replace(' ', '')
    return text.trim()
}

const phoneMask = phone => {
    if (phone !== '' && phone !== undefined) {
        phone = phone.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2')
        return phone.substring(0, 14)
    }
}

const cepMask = cep => {
    cep = cep.substring(0, 8)
    return cep.replace(/[^\d]+/g, '')
}

const chave = () => {
    let date = new Date()
    return date.getTime()
}

const idPedido = id_pedido => {
    return `#${id_pedido.substring(id_pedido.length - 5)}`
}

export {request, cleanAccents, phoneMask, cleanPhone, cepMask, chave, idPedido}
