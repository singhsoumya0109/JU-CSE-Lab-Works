def xor1(a, b):
    """ Returns XOR of 'a' and 'b' (both of the same length) """
    result = ""
    for i in range(1, len(b)):
        result += "0" if a[i] == b[i] else "1"
    return result

def mod2div(dividend, divisor):
    """ Performs Modulo-2 division """
    pick = len(divisor)
    tmp = dividend[:pick]
    while pick < len(dividend):
        if tmp[0] == '1':
            tmp = xor1(divisor, tmp) + dividend[pick]
        else:
            tmp = xor1('0'*pick, tmp) + dividend[pick]
        pick += 1

    if tmp[0] == '1':
        tmp = xor1(divisor, tmp)
    else:
        tmp = xor1('0'*pick, tmp)

    return tmp

def encodeData(data, key):
    """ Function used at the sender side to encode data by appending remainder of modular division at the end of data """
    l_key = len(key)
    appended_data = data + '0'*(l_key - 1)
    remainder = mod2div(appended_data, key)
    codeword = data + remainder
    return codeword, remainder

def receiver(data, key):
    """ Checking if the message received by receiver is correct or not """
    currxor = mod2div(data[:len(key)], key)
    curr = len(key)
    while curr != len(data):
        if len(currxor) != len(key):
            currxor += data[curr]
            curr += 1
        else:
            currxor = mod2div(currxor, key)
    if len(currxor) == len(key):
        currxor = mod2div(currxor, key)
    if '1' in currxor:
        return False
    else:
        return True
