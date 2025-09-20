export interface AddressDTO {
    name: string,
    street: string,
    number: string,
    cep: string,
    city: {
        id: string,
        name: string,
    },
    state: {
        id: string,
        name: string,
        uf: string
    },
    country: {
        id: string,
        name: string
    }
}
