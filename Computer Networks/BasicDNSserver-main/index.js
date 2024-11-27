import dgram from "dgram";
import dnsPacket from "dns-packet";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { recordModel } from "./models/record.model.js";

let cache={};

dotenv.config();

// Create a UDP server
const server = dgram.createSocket('udp4');

// Connect to the database
connectDB();

const getDNSRecord=async (domainName)=>
{
  if(domainName in cache)
  {
    console.log("Found in cache !");
    return cache[domainName];
  }
  else
  {
      console.log("Cache miss!");
      try
      {
        const parts=domainName.split(".");
        const record=await recordModel.find({name:parts[parts.length-1]});
        return record;
      }
      catch(error)
      {
        console.log("Error while fetching! ",error);
      }
  }

}
server.on('message', async (msg, rinfo) => {
  try {
    // Decode the incoming DNS query
    const incomingMsg = dnsPacket.decode(msg);

    // Log the query
    if (incomingMsg.questions && incomingMsg.questions[0]) {
      const domainName = incomingMsg.questions[0].name;
      console.log(`Query for: ${domainName}`);
      console.log("Not found in cache");

      const parts=domainName.split(".");

      // Prepare the DNS response
      const response = {
        type: 'response',
        id: incomingMsg.id,
        flags: dnsPacket.RECURSION_DESIRED | dnsPacket.RECURSION_AVAILABLE | dnsPacket.AUTHORITATIVE_ANSWER, // Proper flags
        questions: incomingMsg.questions,
        answers: [], // Default empty answers
        authority:[],
        additional:[]
      };

      try {
        // Search for the domain in the database
        let record = await getDNSRecord(domainName);
        if(record.length>1)
        {
            response.authority=record;
        }
        else if (record.length==1) 
        {
          if(record[0].type=='A')
          {
            response.answers.push({
              type: record.type, // For example, 'A' for IPv4
              class: 'IN', // Internet class
              name: domainName,
              ttl: 300, // Time-to-live in seconds
              data: record.ip, // IP address from the database
            });
            cache[domainName]=record;
          }
          else if(record[0].type=='NS')
          {
            response.authority.push_back(
              {
                type:record[0].type,
                class:'IN',
                name:record[0].name,
                ttl:300,
                data:record[0].target
              }
            )
          }
          else if(record[0].type=='CNAME')
          {
            response.authority.push(
              {
                type:record[0].type,
                name:record[0].name,
                ttl:300,
                data:record[0].target
              }
            )
          }
        } else {
          // If the domain is not found, set NXDOMAIN (Response Code = 3)
          response.flags |= 3;
        }
      } catch (error) {
        console.error(`Error fetching record from DB: ${error.message}`);
        // Set NXDOMAIN if a DB error occurs
        response.flags |= 3;
      }

      // Encode the DNS response and send it
      const responseBuffer = dnsPacket.encode(response);
      server.send(responseBuffer, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(`Failed to send response: ${err.message}`);
        }
      });
    } else {
      console.warn("Received a malformed DNS query.");
    }
  } catch (error) {
    console.error(`Error processing DNS request: ${error.message}`);
  }
});

// Start listening on the specified port
const port=process.env.PORT|| 10053;
console.log(port);
server.bind(port, () => {
  console.log(`DNS Server is listening on port ${port}`);
});
