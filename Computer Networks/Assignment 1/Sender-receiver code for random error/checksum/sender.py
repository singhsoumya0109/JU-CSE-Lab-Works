import socket
import random

def ones_complement(data):
    """Function to find the One's complement of the given binary string"""
    return ''.join('1' if bit == '0' else '0' for bit in data)

def checksum(data, block_size):
    """Function to return the checksum value of the given string when divided into block_size blocks"""
    n = len(data)
    
    # Pad the data so that its length is a multiple of block_size
    if n % block_size != 0:
        pad_size = block_size - (n % block_size)
        data = '0' * pad_size + data

    # Binary addition of all blocks with carry
    result = data[:block_size]

    for i in range(block_size, len(data), block_size):
        next_block = data[i:i + block_size]
        
        # Perform binary addition of result and next_block
        additions = ""
        sum_val = 0
        carry = 0

        for j in range(block_size - 1, -1, -1):
            sum_val = int(result[j]) + int(next_block[j]) + carry
            if sum_val == 0:
                additions = '0' + additions
                carry = 0
            elif sum_val == 1:
                additions = '1' + additions
                carry = 0
            elif sum_val == 2:
                additions = '0' + additions
                carry = 1
            else:  # sum_val == 3
                additions = '1' + additions
                carry = 1

        # If there's a carry, add it
        if carry == 1:
            final = ""
            for k in range(block_size - 1, -1, -1):
                if carry == 0:
                    final = additions[k] + final
                else:
                    sum_val = int(additions[k]) + carry
                    if sum_val == 2:
                        final = '0' + final
                        carry = 1
                    else:
                        final = str(sum_val) + final
                        carry = 0
            result = final
        else:
            result = additions

    # Return One's complement of result value
    return ones_complement(result)

def read_file(filename):
    """Function to read binary data from a file"""
    with open(filename, 'r') as file:
        return file.read().strip()

def inject_single_bit_error(data):
    """Function to randomly flip a single bit in the data"""
    data_list = list(data)
    index = random.randint(0, len(data_list) - 1)
    data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_two_isolated_errors(data):
    """Function to randomly flip two isolated single bits in the data"""
    data_list = list(data)
    indices = random.sample(range(len(data_list)), 2)
    for index in indices:
        data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_odd_number_of_errors(data):
    """Function to randomly flip an odd number of bits in the data"""
    num_errors = random.choice([1, 3, 5, 7])
    data_list = list(data)
    indices = random.sample(range(len(data_list)), num_errors)
    for index in indices:
        data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def inject_burst_error(data, burst_length=5):
    """Function to randomly flip a consecutive burst of bits in the data"""
    data_list = list(data)
    start_index = random.randint(0, len(data_list) - burst_length)
    for i in range(start_index, start_index + burst_length):
        data_list[i] = '0' if data_list[i] == '1' else '1'
    return ''.join(data_list)

def main():
    # Network configuration
    host = 'localhost'
    port = 12345
    block_size = 8
    
    # Read data from file
    data = read_file('sender_data.txt')
    
    # Compute checksum
    check = checksum(data, block_size)
    
    # Menu for error injection
    print("Choose the type of error to inject:")
    print("1. Single-bit error")
    print("2. Two isolated single-bit errors")
    print("3. Odd number of errors")
    print("4. Burst error")
    print("5. No error")
    
    choice = int(input("Enter your choice (1-5): "))
    
    if choice == 1:
        data = inject_single_bit_error(data)
        print("Single-bit error injected.")
    elif choice == 2:
        data = inject_two_isolated_errors(data)
        print("Two isolated single-bit errors injected.")
    elif choice == 3:
        data = inject_odd_number_of_errors(data)
        print("Odd number of errors injected.")
    elif choice == 4:
        data = inject_burst_error(data)
        print("Burst error injected.")
    elif choice == 5:
        print("No error injected.")
    else:
        print("Invalid choice. No error injected.")
    
    # Create socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.connect((host, port))
        s.sendall((data + '\n' + check).encode())

if __name__ == '__main__':
    main()
