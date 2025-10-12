export const formatCPF = (value: string): string => {
  return value
    .replace(/\D/g, '') // remove tudo que não for número
    .replace(/(\d{3})(\d)/, '$1.$2') // 000.000
    .replace(/(\d{3})(\d)/, '$1.$2') // 000.000.000
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // 000.000.000-00
    .slice(0, 14); // limita ao tamanho máximo
};
