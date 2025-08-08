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
            password: (value) => (value.length < 8 ? "Senha precisa ter no mínimo 8 caracteres." : null),
            confirmPassword: (value, values) =>
                value !== values.password ? "Senhas não coincidem." : null,
            email: (value) => (!/^\S+@\S+$/.test(value) ? "Email inválido." : null),
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
        <section className="flex flex-col h-screen items-center justify-center bg-[url('/images/background-wood.jpg')] bg-cover bg-center px-4">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-sm">
                <Paper withBorder shadow="lg" p="xl" radius="md">
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack spacing="md">
                            <Title
                                align="center"
                                mb="md"
                                className="text-3xl font-bold text-orange-500"
                            >
                                Registro
                            </Title>

                            <TextInput
                                label="Nome"
                                size="md"
                                placeholder="seu nome"
                                {...form.getInputProps('name')}
                                required
                            />

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

                            <PasswordInput
                                label="Confirme sua senha"
                                size="md"
                                placeholder="••••••••"
                                {...form.getInputProps('confirmPassword')}
                                required
                            />

                            <span
                                className="text-center text-md text-orange-500 font-bold cursor-pointer hover:underline"
                                onClick={() => navigate("/login")}
                            >
                                Já possui conta? Entre
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
                                Registrar
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </div>
        </section>
    );
}
