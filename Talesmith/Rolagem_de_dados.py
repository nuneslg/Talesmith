import random

def rolar_d20():
    print("\nOs dados estão sendo rolados... Boa sorte!")
    resultado = random.randint(1, 20)
    print(f"Resultado do dado: {resultado}")
    return resultado
