import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type IButtonProps = TouchableOpacityProps & {
  text: string;
};

export const Button = ({ text }: IButtonProps) => {
  return <TouchableOpacity>{text}</TouchableOpacity>;
};
