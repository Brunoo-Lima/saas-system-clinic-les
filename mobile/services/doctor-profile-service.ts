import { useQuery } from "@tanstack/react-query"
import api from "./api"

export interface IDoctorProfile {
    id: string,
    crm: string,
    name: string,
    cpf: string,
    sex: string,
    dateOfBirth: string,
    phone: string,
    specialties: Array<{
        id: string,
        name: string,
        percentDistribution: string
    }>,
    periodToWork: Array<
        {
            id: string,
            dayWeek: number,
            timeFrom: string,
            timeTo: string,
            specialty_id: string
        }
    >,
    user: {
        id: string,
        email: string,
        status: boolean,
        password: string,
        profileCompleted: boolean,
        emailVerified: boolean,
        username: string
    },
    address: {
        id: string,
        name: string,
        street: string,
        cep: string,
        number: string,
        neighborhood: string,
        city: string,
        state: string,
        uf: string,
        country: string
    }
}

export interface IDoctorGetProfile {
    user_id: string
    token: string | null
}

export const getProfileDoctor = async ({ user_id, token }: IDoctorGetProfile) => {
    const { data } = await api.get('/doctor/findall', {
        params: {
            user_id
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (data.success === false) {
        throw new Error(data.message);
    }

    return data.data;
}

export const useGetProfileDoctor = (params: IDoctorGetProfile) => {
    return useQuery<Array<IDoctorGetProfile>>({
        queryKey: ["doctorProfile", params],
        queryFn: () => getProfileDoctor(params || {})
    })
}