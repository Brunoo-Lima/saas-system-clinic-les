export const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '') // remove tudo que não for número
    .replace(/^(\d{2})(\d)/, '$1.$2') // 00.000
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // 00.000.000
    .replace(/\.(\d{3})(\d)/, '.$1/$2') // 00.000.000/0000
    .replace(/(\d{4})(\d)/, '$1-$2') // 00.000.000/0000-00
    .slice(0, 18);
};
