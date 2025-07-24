import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import {
    TextInput,
    PasswordInput,
    Paper,
    Title,
    Button,
    Stack,
} from '@mantine/core';
import { signIn } from '../../services/auth';
import { notifications } from '@mantine/notifications';

export default function LoginPage() {
    const navigate = useNavigate()
    const form = useForm({

        initialValues: { email: "", password: "" },

        validate: {

            password: (value) => {
                if (value.length < 8) {
                    return "Senha precisa ter no min 8 caracteres."
                }

                return null
            },

            email: (value) => {
                if (!/^\S+@\S+$/.test(value)) {
                    return "Email invalido."
                }

                return null
            }

        },
    });

    const handleSubmit = async (values) => {
        
        const user = await signIn({
            email: values.email,
            password: values.password
        })

        if(user){
            notifications.show({
                title: "Autenticado com sucesso!",
                color: "orange",
                autoClose: 4000
            })

            return navigate("/config", {state: {userId: user.id}})
        }

        notifications.show({
            title: "Erro ao logar.",
            color: "red",
            autoClose: 4000
        })
    };

    return (
        <section className="flex flex-col h-screen items-center bg-[url('images/background-wood.jpg')] bg-cover bg-center">


            <div className="w-1/4 mt-32">

                <Paper withBorder shadow="2lg" p={60} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>

                            <Title align="center" mb="lg" shadow="xl" className="text-3xl font-bold text-orange-500">
                                Entrar
                            </Title>

                            <TextInput
                                label="E-mail"
                                size="lg"
                                placeholder="seu@email.com"
                                {...form.getInputProps('email')}
                                required

                            />

                            <PasswordInput
                                label="Senha"
                                size="lg"
                                placeholder="••••••••"
                                {...form.getInputProps('password')}
                                required
                            />

                            <span
                                className="text-center text-md text-orange-500 font-bold cursor-pointer"
                                onClick={() => navigate("/register")}
                            >
                                Nao possui conta? Registre-se
                            </span>

                            <Button type="submit"
                                fullWidth mt="md"
                                bg="orange" c="white"
                                h={50} radius="md"
                                className='font-bold text-lg hover:opacity-80'
                            >
                                Entrar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </div>
        </section>
    );
}
