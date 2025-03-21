from scapy.all import sniff
from collections import defaultdict
import time

# Dictionary to store network flows
flows = defaultdict(lambda: {"bytes": 0, "packets": 0, "start_time": None, "end_time": None})

# Packet processing function
def packet_callback(pkt):
    if pkt.haslayer("IP"):
        src_ip = pkt["IP"].src
        dst_ip = pkt["IP"].dst
        proto = pkt["IP"].proto
        src_port = pkt["TCP"].sport if pkt.haslayer("TCP") else pkt["UDP"].sport if pkt.haslayer("UDP") else None
        dst_port = pkt["TCP"].dport if pkt.haslayer("TCP") else pkt["UDP"].dport if pkt.haslayer("UDP") else None
        key = (src_ip, src_port, dst_ip, dst_port, proto)

        # Update flow information
        flows[key]["bytes"] += len(pkt)
        flows[key]["packets"] += 1
        if flows[key]["start_time"] is None:
            flows[key]["start_time"] = time.time()
        flows[key]["end_time"] = time.time()

# Capture packets for 15 minutes
print("Capturing packets for 5 seconds...")
sniff(filter="tcp or udp or icmp", prn=packet_callback, timeout=5)  # 900 seconds = 15 minutes

# Analyze the results
print("\nTop 10 Largest Flows (by bytes):")
top_flows = sorted(flows.items(), key=lambda x: x[1]["bytes"], reverse=True)[:10]
for flow, data in top_flows:
    src_ip, src_port, dst_ip, dst_port, proto = flow
    duration = data["end_time"] - data["start_time"]
    print(f"Flow: {src_ip}:{src_port} → {dst_ip}:{dst_port} | Protocol: {proto} | Bytes: {data['bytes']} | Packets: {data['packets']} | Duration: {duration:.2f}s")

print("\nTop Talkers (by packets sent):")
top_talkers = defaultdict(int)
for flow, data in flows.items():
    src_ip = flow[0]
    top_talkers[src_ip] += data["packets"]

top_talkers_sorted = sorted(top_talkers.items(), key=lambda x: x[1], reverse=True)[:10]
for ip, packets in top_talkers_sorted:
    print(f"IP: {ip} | Packets Sent: {packets}")