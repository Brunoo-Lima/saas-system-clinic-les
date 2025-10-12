export const formatCRM = (value: string): string => {
  return value
    .toUpperCase() // força letras maiúsculas
    .replace(/[^A-Z0-9]/g, '') // remove tudo que não é letra ou número
    .replace(/^([A-Z]{2,3})(\d)/, '$1-$2') // adiciona hífen depois da sigla
    .slice(0, 10); // limite (ex: SP-123456)
};
