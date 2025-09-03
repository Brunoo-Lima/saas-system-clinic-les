import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SignupForm from './_components/signup-form';

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-[90vh]">
      <Card className="w-[1200px]">
        <CardHeader>
          <CardTitle>Cadastro de Clinica</CardTitle>
          <CardDescription>
            Preencha os dados para criar uma nova conta
          </CardDescription>
        </CardHeader>

        <CardContent className="max-h-[700px] overflow-hidden">
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
