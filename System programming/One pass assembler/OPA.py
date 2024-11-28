import os

# Global registers
AX, BX, CX, DX = 0, 0, 0, 0

# Symbol table for labels and variables
symbol_table = {}

# Helper function to convert string to uppercase
def to_uppercase(s):
    return s.upper()

# Function to tokenize file content
def tokenize_file(filename):
    tokens = []
    if not os.path.isfile(filename):
        print(f"Error: Unable to open file {filename}")
        return tokens

    with open(filename, 'r') as file:
        word = ''
        while True:
            ch = file.read(1)
            if not ch:
                break
            if ch.isspace() or ch == ',' or ch == ':':
                if word:
                    tokens.append(word)
                    word = ''
                if ch == ':':
                    tokens.append(':')
            else:
                word += ch
        if word:
            tokens.append(word)
    return tokens

# Helper function to check if a string is a valid number
def is_number(s):
    if not s:
        return False
    if s[0] == '-':
        return s[1:].isdigit()
    return s.isdigit()

# Function to get 8086 binary opcode for a given instruction
def get_binary_opcode(instruction, operand1, operand2):
    opcode_map = {
        "MOV": "100010",
        "ADD": "000000",
        "SUB": "001010",
        "MUL": "111011",
        "DIV": "111000"
    }

    register_map = {"AX": "000", "BX": "001", "CX": "010", "DX": "011"}

    binary_code = opcode_map.get(instruction, '')

    if operand1 in register_map:
        if operand2 in register_map:
            binary_code += f" {register_map[operand1]} {register_map[operand2]}"
        elif is_number(operand2):
            immediate_value = int(operand2)
            immediate_binary = format(immediate_value, '016b')
            binary_code += f" {register_map[operand1]} {immediate_binary}"
        elif operand2 in symbol_table:
            value = symbol_table[operand2]
            value_binary = format(value, '016b')
            binary_code += f" {register_map[operand1]} {value_binary}"

    return binary_code

# Function to parse and execute instructions
def parse_instructions(tokens):
    global AX, BX, CX, DX
    binary_code = ''
    i = 0

    while i < len(tokens):
        instruction = to_uppercase(tokens[i])

        if instruction in {"MOV", "ADD", "SUB", "MUL", "DIV"}:
            if i + 2 >= len(tokens):
                print(f"Error: Invalid instruction format for {instruction}")
                break

            operand1 = to_uppercase(tokens[i + 1])
            operand2 = to_uppercase(tokens[i + 2])

            value = 0

            if is_number(operand2):
                value = int(operand2)
            elif operand2 in symbol_table:
                value = symbol_table[operand2]
            elif operand2 == "AX":
                value = AX
            elif operand2 == "BX":
                value = BX
            elif operand2 == "CX":
                value = CX
            elif operand2 == "DX":
                value = DX
            else:
                print(f"Error: Invalid operand {operand2}")
                break

            if instruction == "MOV":
                if operand1 == "AX":
                    AX = value
                elif operand1 == "BX":
                    BX = value
                elif operand1 == "CX":
                    CX = value
                elif operand1 == "DX":
                    DX = value
                elif operand1 in symbol_table:
                    symbol_table[operand1] = value
                else:
                    print(f"Error: Invalid destination {operand1}")
            elif instruction == "ADD":
                if operand1 == "AX":
                    AX += value
                elif operand1 == "BX":
                    BX += value
                elif operand1 == "CX":
                    CX += value
                elif operand1 == "DX":
                    DX += value
                else:
                    print(f"Error: Invalid destination {operand1}")
            elif instruction == "SUB":
                if operand1 == "AX":
                    AX -= value
                elif operand1 == "BX":
                    BX -= value
                elif operand1 == "CX":
                    CX -= value
                elif operand1 == "DX":
                    DX -= value
                else:
                    print(f"Error: Invalid destination {operand1}")
            elif instruction == "MUL":
                if operand1 == "AX":
                    AX *= value
                elif operand1 == "BX":
                    BX *= value
                elif operand1 == "CX":
                    CX *= value
                elif operand1 == "DX":
                    DX *= value
                else:
                    print(f"Error: Invalid destination {operand1}")
            elif instruction == "DIV":
                if value == 0:
                    print(f"Error: Division by zero for operand {operand2}")
                    break
                if operand1 == "AX":
                    AX //= value
                elif operand1 == "BX":
                    BX //= value
                elif operand1 == "CX":
                    CX //= value
                elif operand1 == "DX":
                    DX //= value
                else:
                    print(f"Error: Invalid destination {operand1}")

            binary_code += get_binary_opcode(instruction, operand1, operand2) + "\n"
            i += 3
        elif tokens[i] == ":":
            if i > 0:
                label = tokens[i - 1]
                symbol_table[label] = i - 1
            i += 1
        elif i + 1 < len(tokens) and tokens[i + 1] == "DW":
            if i + 2 >= len(tokens):
                print(f"Error: Invalid DW declaration at token {i}")
                i += 1
                continue
            var_name = tokens[i]
            value = int(tokens[i + 2])
            symbol_table[var_name] = value
            i += 3
        else:
            i += 1

    return binary_code

# Main function
def main():
    filename = input("Enter the name of the file containing assembly code: ")

    tokens = tokenize_file(filename)

    binary_code = parse_instructions(tokens)

    with open("object.txt", 'w') as out_file:
        out_file.write(binary_code)

    with open("symboltable.txt", 'w') as symbol_table_file:
        symbol_table_file.write("Symbol Table:\n")
        for key, value in symbol_table.items():
            symbol_table_file.write(f"{key} = {value}\n")

    with open("registers.txt", 'w') as registers_file:
        registers_file.write("Final Register Values:\n")
        registers_file.write(f"AX = {AX}\n")
        registers_file.write(f"BX = {BX}\n")
        registers_file.write(f"CX = {CX}\n")
        registers_file.write(f"DX = {DX}\n")

if __name__ == "__main__":
    main()