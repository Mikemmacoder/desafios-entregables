export const generateErrorInfo = product => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
        - product.title: Must be a string. (${product.title})
        - product.description : Must be a string. (${product.description })
        - product.price : Must be a number. (${product.price })
        - product.code : Must be a string. (${product.code })
        - product.stock : Must be a number. (${product.stock })
        - product.status : Must be a boolean. (${product.status })
        - product.category : Must be a string. (${product.category })
    `
}