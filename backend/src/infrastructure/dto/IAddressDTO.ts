export interface IAddressDTO {
    name: string,
    street: string,
    number: string,
    neighborhood: {
        id: string,
        name: string
    },
    city: {
        id: string,
        name: string,
        zipcode: string

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
