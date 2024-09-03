import socket
import random
import time

def ones_complement(data):
    """Function to find the One's complement of the given binary string."""
    return ''.join('1' if bit == '0' else '0' for bit in data)

def checksum(data, block_size):
    """Function to return the checksum value of the given string when divided into block_size blocks."""
    n = len(data)
    
    # Pad the data so that its length is a multiple of block_size.
    if n % block_size != 0:
        pad_size = block_size - (n % block_size)
        data = '0' * pad_size + data

    # Binary addition of all blocks with carry.
    result = data[:block_size]

    for i in range(block_size, len(data), block_size):
        next_block = data[i:i + block_size]
        
        # Perform binary addition of result and next_block.
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

        # If there's a carry, add it.
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

    # Return One's complement of result value.
    return ones_complement(result)

def read_file(filename):
    """Function to read binary data from a file."""
    with open(filename, 'r') as file:
        return file.read().strip()

def inject_error(data):
    """Function to inject error with 50% probability."""
    if random.random() < 0.4:
        return inject_single_bit_error(data)
    return data

def inject_single_bit_error(data):
    """Function to randomly flip a single bit in the data."""
    data_list = list(data)
    index = random.randint(0, len(data_list) - 1)
    data_list[index] = '0' if data_list[index] == '1' else '1'
    return ''.join(data_list)

def send_frame(sock, frame, checksum_val):
    """Send the frame along with checksum to the receiver."""
    sock.sendall((frame + '\n' + checksum_val).encode())
    print("Frame sent:", frame)

def recv_ack(sock):
    """Receive acknowledgment from the receiver."""
    try:
        sock.settimeout(0.005)  # Set timeout to 5 milliseconds.
        ack = sock.recv(1024).decode()
        return ack
    except socket.timeout:
        print("Timeout! Resending frame...")
        return None

def stop_and_wait_sender(filename):
    host = 'localhost'
    port = 12345
    block_size = 8

    # Read data from file.
    data = read_file(filename)

    # Divide data into blocks of size 8.
    blocks = [data[i:i + block_size] for i in range(0, len(data), block_size)]
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((host, port))

    for block in blocks:
        # Compute checksum.
        checksum_val = checksum(block, block_size)

        while True:
            # Inject errors with 50% probability for each new transmission attempt.
            block_with_error = inject_error(block)

            # Send frame.
            send_frame(sock, block_with_error, checksum_val)

            # Wait for ACK.
            ack = recv_ack(sock)
            if ack == "ACK":
                print("Acknowledgment received for block.")
                break
            else:
                print("Resending block due to error detected.")
            time.sleep(2)  # Wait 5ms before resending.

    sock.close()

if __name__ == '__main__':
    stop_and_wait_sender('abc.txt')
