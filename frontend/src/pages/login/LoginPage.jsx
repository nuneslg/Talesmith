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
import { notifications } from '@mantine/notifications';

export default function LoginPage() {
    const navigate = useNavigate();
    const form = useForm({
        initialValues: { email: "", password: "" },
        validate: {
            password: (value) => {
                if (value.length < 8) {
                    return "Senha precisa ter no min 8 caracteres.";
                }
                return null;
            },
            email: (value) => {
                if (!/^\S+@\S+$/.test(value)) {
                    return "Email inválido.";
                }
                return null;
            },
        },
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch("https://talesmith.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Erro ao fazer login");
            }

            const user = await response.json();

            notifications.show({
                title: "Autenticado com sucesso!",
                color: "orange",
                autoClose: 4000,
            });

            navigate("/historias", { state: { userId: user.id } });
        } catch (error) {
            notifications.show({
                title: error.message || "Erro ao logar.",
                color: "red",
                autoClose: 4000,
            });
        }
    };

    return (
        <section className="flex flex-col h-screen items-center justify-center bg-[url('/images/background-wood.jpg')] bg-cover bg-center px-4">
            {/* Ajuste a largura com responsividade */}
            <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-sm">
                <Paper withBorder shadow="lg" p="xl" radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack spacing="md">
                            <Title
                                align="center"
                                mb="md"
                                className="text-3xl font-bold text-orange-500"
                            >
                                Entrar
                            </Title>

                            <TextInput
                                label="E-mail"
                                size="md"
                                placeholder="seu@email.com"
                                {...form.getInputProps('email')}
                                required
                            />

                            <PasswordInput
                                label="Senha"
                                size="md"
                                placeholder="••••••••"
                                {...form.getInputProps('password')}
                                required
                            />

                            <span
                                className="text-center text-md text-orange-500 font-bold cursor-pointer hover:underline"
                                onClick={() => navigate("/register")}
                            >
                                Não possui conta? Registre-se
                            </span>

                            <Button
                                type="submit"
                                fullWidth
                                mt="md"
                                color="orange"
                                radius="md"
                                size="md"
                                className="font-bold text-lg hover:opacity-80"
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
