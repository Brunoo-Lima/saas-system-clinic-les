export const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, '') // remove tudo que não for número
    .replace(/^(\d{5})(\d)/, '$1-$2') // 99999-999
    .slice(0, 9); // limita a 9 caracteres
};
