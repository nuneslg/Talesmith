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
import { notifications } from "@mantine/notifications";

export default function RegisterPage() {
    const navigate = useNavigate();
    const form = useForm({

        initialValues: { email: "", name: "", password: "", confirmPassword: "" },

        validate: {
            password: (value) => {
                if (value.length < 8) {
                    return "Senha precisa ter no mínimo 8 caracteres.";
                }
                return null;
            },

            confirmPassword: (value, values) => {
                if (value !== values.password) {
                    return "Senhas não coincidem.";
                }
                return null;
            },

            email: (value) => {
                if (!/^\S+@\S+$/.test(value)) {
                    return "Email inválido.";
                }
                return null;
            }
        },
    });

    const handleSubmit = async (values) => {
        try {
            const response = await fetch("https://talesmith.onrender.com/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: values.name,
                    email: values.email,
                    password: values.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.erro || "Erro no registro");
            }

            const user = await response.json();

            notifications.show({
                color: "orange",
                title: "Registrado com sucesso!",
                autoClose: 4000,
            });

            navigate("/historias", { state: { userId: user.id } });

        } catch (error) {
            notifications.show({
                color: "red",
                title: error.message || "Erro no registro.",
                autoClose: 4000,
            });
        }
    };

    return (
        <section className="flex flex-col h-screen items-center bg-[url('/images/background-wood.jpg')] bg-cover bg-center">
            <div className="w-1/4 mt-32">
                <Paper withBorder shadow="2lg" p={60} radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            <Title align="center" mb="lg" shadow="xl" className="text-3xl font-bold text-orange-500">
                                Registro
                            </Title>

                            <TextInput
                                label="Nome"
                                size="lg"
                                placeholder="seu nome"
                                {...form.getInputProps('name')}
                                required
                            />

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

                            <PasswordInput
                                label="Confirme sua senha"
                                size="lg"
                                placeholder="••••••••"
                                {...form.getInputProps('confirmPassword')}
                                required
                            />

                            <span
                                className="text-center text-md text-orange-500 font-bold cursor-pointer"
                                onClick={() => navigate("/login")}
                            >
                                Ja possui conta ? Entre
                            </span>

                            <Button type="submit"
                                fullWidth mt="md"
                                bg="orange" c="white"
                                h={50} radius="md"
                                className='font-bold text-lg hover:opacity-80'
                            >
                                Registrar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </div>
        </section>
    );
}
