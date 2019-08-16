import socket
import thread
import pickle
import os
import sys
import math
import hashlib
import time

ip = 'localhost'
MAX_NODES = 8
end=False
finger_len = int(math.log(MAX_NODES,2.0))

class Node:
	def __init__(self, port):
		self.port = int(port)
		self.key = self.port % MAX_NODES
		self.succ_p = self.port
		self.succ_k = self.key
		self.pred_p= self.port
		self.pred_k = self.key
		self.second_succ_p = self.port
		self.second_succ_k = self.key
		
		self.files=[]
		self.finger = [[],[],[]]
		for i in range(finger_len):
			self.finger[0].append((self.key+2**i)%MAX_NODES)
			self.finger[1].append(self.key)
			self.finger[2].append(self.port)

def one_way_comm(own_node, send_to_port, message): #given a message and who to send it to, send that message
	temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	temp.connect((ip, send_to_port))
	temp.send(message)
	temp.close()

def distribute_files(own_node): #when a new node is your predecessor, check which files you have that belong to it and send it those
	for filename in own_node.files: 								
		hash_object = hashlib.sha1(filename)																		#e.g 1. own=5 have file=3 new_pred=4
		filekey = int(hash_object.hexdigest() , 16)%MAX_NODES	 												   	#e.g 2. own=1 have file=6 new_pred=6/0
		print "\nDistribution check for file",filename," key",filekey												#send to predecessor own=1 file=0 
		
		# if (filekey<=own_node.pred_k and own_node.pred_k<own_node.key) or ((own_node.pred_k<own_node.key) and filekey>own_node.key): 
		send=False
		if filekey<own_node.key:
			if own_node.pred_k<own_node.key:
				if filekey<=own_node.pred_k:
					send=True
		elif filekey>own_node.key:
			if own_node.pred_k>own_node.key and filekey<=own_node.pred_k:
				send=True
			elif own_node.pred_k<own_node.key:
				send=True

		if send==True:
			print "Distributing file",filename,"to", own_node.pred_p 															  
			try:
				temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
				temp.connect((ip, own_node.pred_p))
				temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key))
				response = temp.recv(1048576)
				if response=="proceed":
					f = open(filename, 'rb')
					line = f.read(1048576)
					while(line):
						temp.send(line)
						line= f.read(1048576)
				temp.close()
				# own_node.files.remove(filename)
			except socket.error:
				print "Couldn't distribute file", filename, "to", own_node.pred_p
				pass

def listen4messages(conn_port, addr, own_node):	#thread to listen for any messages you recv and cater to them accordingly 
	while True:
		try: 
			message = conn_port.recv(1024)
		except socket.error:
			break

		if message!="":
			message = message.split()

			if message[0]=="sending":										#receive file when (pred is leaving) or (redistribution) or (put/upload)
				filename= message[1]
				print "\nReceiving File",filename, "From",message[2]
				
				if os.path.isfile(str(filename)): 								#already have file
					conn_port.send("have_file")
					conn_port.close()
					print "I Already Have File",filename
					if filename not in own_node.files:
						own_node.files.append(filename)

				else:															#get the file
					conn_port.send("proceed")
					file = open(filename, 'wb')
					line = conn_port.recv(1048576)
					while (line):
						file.write(line)
						line= conn_port.recv(1048576)
					conn_port.close()
					own_node.files.append(filename)
					print "\nReceived File", filename
					
				if len(message)==5: 										#upload req received. replicate at successor
					if int(message[4])==own_node.port:						#if i am getting replicated copy, i will not forward
						print "\nReplicating at Successor",own_node.succ_k
						try:
							temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
							temp.connect((ip, own_node.succ_p))
							temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key))
							response = temp.recv(1024)
							if response=="proceed":
								f = open(filename, 'rb')
								line = f.read(1048576)
								while(line):
									temp.send(line)
									line= f.read(1048576)
							temp.close()
							# own_node.files.remove(filename)
						except socket.error:
							print "\nCouldn't replicate file", filename
							pass

			elif message[0]=="sendfile":										#getfile/downloading 
				print message
				filename = message[1]
				if filename not in own_node.files:								#if I dont have the file (shouldnt happen)
					conn_port.send("I don't have the file sorry")
					conn_port.close()
				else:															#send the file
					print "\nSending File",filename,"to",message[2]				
					conn_port.send("proceed")
					f = open(filename, 'rb')
					unwanted = f.read(int(message[4]))
					line = f.read(1048576)
					while(line):
						conn_port.send(line)
						line= f.read(1048576)
					conn_port.close()

			elif message[0]=="give_succ": 										#return your successor
				new_message = "mysucc " + str(own_node.succ_k) + " " + str(own_node.succ_p)
				conn_port.send(new_message)
				conn_port.close()

			elif message[0]=="leaving": #someone left the network...FORMAT: leaving who_left_k who_left_p new new_k new_p who_sent_message_p
				# print "leaving"
				if (int(message[1])==own_node.key and int(message[2])==own_node.port) or int(message[6])==own_node.port:
					pass
				else:
					who_left_k = int(message[1])
					who_left_p = int(message[2])
					for i in range(finger_len):
						if own_node.finger[1][i] == who_left_k and own_node.finger[2][i]==who_left_p:
							own_node.finger[1][i] = int(message[4])
							own_node.finger[2][i] = int(message[5])

					try:
						new_message = "leaving " + str(who_left_k) + " " + str(who_left_p) + " new " + message[4] + " " + message[5] + " " + message[6]
						one_way_comm(own_node,own_node.pred_p,new_message)
					except socket.error:
						pass

			elif message[0]=="pred":
				# print "pred"											#update pred succ 2ndsucc, fingertable
				if int(message[1])!=-1 and int(message[7])!=-1:
					own_node.pred_k = int(message[1])
					own_node.pred_p = int(message[7])
					if own_node.pred_p!=own_node.port:
						distribute_files(own_node)								#send pred all files that would now belong to it

				if int(message[3])!=-1 and int(message[9])!=-1:
					own_node.succ_k = int(message[3])
					own_node.succ_p = int(message[9])
					for i in range(finger_len):	
						if own_node.succ_k<own_node.key: 						#my successor is smaller than me					
							if own_node.finger[0][i]>own_node.key:				#for situation e.g 6 has keys 7,0,2 and its succ is 1, so val for 7 will be 1
								own_node.finger[1][i] = own_node.succ_k
								own_node.finger[2][i] = own_node.succ_p
						else:													#my successor is bigger than me
							if own_node.finger[0][i]<own_node.key:				#the key is smaller than me (loop around)
								# print "not changing for key",own_node.finger[0][i],"val",own_node.finger[1][i]
								pass				
							elif own_node.succ_k>=own_node.finger[0][i]: 		#replace myself as val in finger table or if you are smaller than the value already written
								if own_node.finger[2][i] == own_node.port or own_node.finger[1][i]>own_node.succ_k:
									own_node.finger[1][i]= own_node.succ_k
									own_node.finger[2][i]= own_node.succ_p

				if int(message[5])!=-1 and int(message[11])!=-1:
					own_node.second_succ_k = int(message[5])
					own_node.second_succ_p= int(message[11])

				if message[4]=="2ndsuccX":
					try:
						new_message = "pred " + str(-1)  +" succ "+ str(-1) + " 2ndsucc " + str(own_node.succ_k) + " pred " + str(-1) + " succ " + str(-1) + " 2ndsucc "+str(own_node.succ_p)
						one_way_comm(own_node,own_node.pred_p,new_message)
					except socket.error:
						pass

				if message[2]=="succ1":
					try:
						for i in range(1,finger_len):
							# print "inside succ0",i, own_node.pred_k, own_node.succ_k, own_node.second_succ_k
							if own_node.finger[2][i]==own_node.port and own_node.second_succ_p!=own_node.port:
								# print "get successor for", own_node.finger[0][i]
								temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
								temp.connect((ip, int(own_node.finger[2][i-1])))
								new_message = "get_succ " + str(own_node.finger[0][i]) + " " + str(own_node.key)
								temp.send(new_message)
								found_it = temp.recv(1024)
								found_it = found_it.split()
								own_node.finger[1][i] = int(found_it[1])
								own_node.finger[2][i] = int(found_it[2])
								temp.close()
					except socket.error:
						pass

					try:
						new_message = "update_finger " + str(own_node.key) + " "+ str(own_node.port) 
						one_way_comm(own_node,own_node.pred_p,new_message)
					except socket.error:
						pass

				conn_port.close()

			elif message[0]=="get_succ":												#FORMAT: "get_succ", whos_succ_needed, who_sent_message 
				# print own_node.key,"received:",message
				waiting_node_k = int(message[1])

				max_less_than_you_k=-1
				max_less_than_you_p=-1
				check=False
				check_full=False
				if own_node.pred_k>own_node.key and waiting_node_k>own_node.pred_k:
					max_less_than_you_p= own_node.port
					max_less_than_you_k= own_node.key
					check=True
				
				else:
					key = -1
					for i in range(finger_len):
						# print "now checking for",own_node.finger[0][i]						 #check for a close match
						if own_node.finger[0][i]<=waiting_node_k and own_node.finger[0][i]>=key:
							key= own_node.finger[0][i]
							max_less_than_you_k = own_node.finger[1][i]
							max_less_than_you_p = own_node.finger[2][i]

					# print "closest match:", key, max_less_than_you_k, max_less_than_you_p
					if max_less_than_you_k==-1:												#if no close match found
						max_less_than_you_k = own_node.finger[1][finger_len-1]
						max_less_than_you_p = own_node.finger[2][finger_len-1]
						key = own_node.finger[0][finger_len-1]
						check_full=True

				if (max_less_than_you_k>=waiting_node_k or check==True) and check_full==False:									#if you found a match
					conn_port.send("found_it " + str(max_less_than_you_k) + " " + str(max_less_than_you_p))
					# print "found it at", max_less_than_you_p
				else:
					try:
						temp2=socket.socket(socket.AF_INET, socket.SOCK_STREAM)												#forward get_succ request
						temp2.connect((ip, max_less_than_you_p))
						new_message = "get_succ " + str(waiting_node_k) + " " + message[2]
						temp2.send(new_message)
						found_it2 = temp2.recv(1024)
						temp2.close()
						conn_port.send(found_it2)
					except socket.error:
						pass
				conn_port.close()

			elif message[0]=="update_finger":										
				print "\nFinger Table Update", message
				new_k = int(message[1])
				new_p = int(message[2])
				if new_k==own_node.key and new_p==own_node.port:						#stop after a full circle
					pass
				else:
					check=False
					for i in range(finger_len):
						if own_node.finger[0][i]>own_node.key:
							check==True													#keys:6 7 1, check=True at 1

						if new_k>=own_node.finger[0][i]:
							if own_node.finger[1][i]>new_k or (own_node.finger[0][i]>own_node.key and own_node.finger[1][i]==own_node.key):
								# print "1updating for key:",own_node.finger[0][i], "new:", new_k
								own_node.finger[1][i]=new_k
								own_node.finger[2][i]=new_p
							
							if own_node.finger[1][i]<own_node.finger[0][i]: 
								own_node.finger[1][i]=new_k
								own_node.finger[2][i]=new_p
						else:
							if check==True:
								if own_node.finger[1][i]>new_k and new_k>own_node.key:
									# print "2updating for key:",own_node.finger[0][1]
									own_node.finger[1][i]=new_k
									own_node.finger[2][i]=new_p
					try:
						new_message = "update_finger " + str(new_k) + " " + str(new_p)
						one_way_comm(own_node,own_node.pred_p,new_message) 				#now tell your predecessor to update its finger table
					except socket.error:
						pass

				conn_port.close()

			elif message[1]=="join":													#new node requesting to join network
				who_sent_message = int(message[0])
				what_they_sent = message[1]
				# print who_sent_message, what_they_sent
				
				if (who_sent_message%MAX_NODES)>int(own_node.key):
					if own_node.succ_k == own_node.key and own_node.pred_k==own_node.key: 	#own port was a single node in the network
						own_node.succ_p=who_sent_message
						own_node.succ_k= who_sent_message%MAX_NODES
						own_node.pred_p=who_sent_message
						own_node.pred_k= who_sent_message%MAX_NODES
						new_message = "pred " + str(own_node.key)+ " succ1 "+str(own_node.key)+" 2ndsucc "+str(own_node.succ_k)+" pred "+str(own_node.port)+ " succ "+str(own_node.port)+" 2ndsucc "+str(own_node.succ_p)
						conn_port.send(new_message)
						conn_port.close()
						if own_node.pred_p!=own_node.port:
							distribute_files(own_node)									#send pred all files that would now belong to it

					else:
						if own_node.succ_k > own_node.key:								#not last node in the network
							if (who_sent_message%MAX_NODES) < own_node.succ_k:
								new_message = "pred " + str(own_node.key) + " succ1 " +str(own_node.succ_k)+" 2ndsucc "+str(own_node.second_succ_k)+" pred "+str(own_node.port)+ " succ "+str(own_node.succ_p)+" 2ndsucc "+str(own_node.second_succ_p)
								conn_port.send(new_message)
								conn_port.close()
								try:
									new_message = "pred " + str(who_sent_message%MAX_NODES) + " succ " +str(-1)+" 2ndsucc "+str(-1)+" pred "+str(who_sent_message)+ " succ "+str(-1)+" 2ndsucc "+str(-1)
									one_way_comm(own_node,own_node.succ_p,new_message) 	#update successor's pred
								except socket.error:
									pass

								try:								
									new_message = "pred " + str(-1) + " succ " +str(-1)+" 2ndsucc "+str(who_sent_message%MAX_NODES)+" pred "+str(-1)+ " succ "+str(-1)+" 2ndsucc "+str(who_sent_message)
									one_way_comm(own_node,own_node.pred_p,new_message)  #update pred's second_succ
								except socket.error:
									pass

								own_node.second_succ_k = own_node.succ_k
								own_node.second_succ_p = own_node.succ_p
								own_node.succ_k = who_sent_message%MAX_NODES
								own_node.succ_p = who_sent_message
								conn_port.close()
								
							else:	
								if own_node.pred_k>own_node.key and ((who_sent_message%MAX_NODES)>own_node.pred_k):
									new_message = "pred " + str(own_node.pred_k) + " succ1 " +str(own_node.key)+" 2ndsucc "+str(own_node.succ_k)+" pred "+str(own_node.pred_p)+ " succ "+str(own_node.port)+" 2ndsucc "+str(own_node.succ_p)
									conn_port.send(new_message)
									conn_port.close()
									try:
										new_message = "pred " + str(-1) + " succ " +str(who_sent_message%MAX_NODES)+" 2ndsuccX "+str(own_node.key)+" pred "+str(-1)+ " succ "+str(who_sent_message)+" 2ndsucc "+str(own_node.port)	
										one_way_comm(own_node,own_node.pred_p,new_message) 
									except socket.error:
										pass

									own_node.pred_k = who_sent_message%MAX_NODES
									own_node.pred_p = who_sent_message

								else:
									max_less_than_you_k=-1
									max_less_than_you_p=-1
									for i in range(finger_len):
										if own_node.finger[0][i]<=(who_sent_message%MAX_NODES) and own_node.finger[0][i]>max_less_than_you_k:
											max_less_than_you_k = own_node.finger[1][i]
											max_less_than_you_p = own_node.finger[2][i]

									if max_less_than_you_k==-1:
										max_less_than_you_k = own_node.finger[1][finger_len-1]
										max_less_than_you_p = own_node.finger[2][finger_len-1]

									conn_port.send("connect " + str(max_less_than_you_p) + " "+ str(max_less_than_you_k))
									conn_port.close()
						
						elif own_node.succ_k<own_node.key:

							new_message = "pred " + str(own_node.key) + " succ1 " +str(own_node.succ_k)+" 2ndsucc "+str(own_node.second_succ_k)+" pred "+str(own_node.port)+ " succ "+str(own_node.succ_p)+" 2ndsucc "+str(own_node.second_succ_p)
							conn_port.send(new_message)
							conn_port.close()
							try:
								new_message = "pred " + str(who_sent_message%MAX_NODES) + " succ " +str(-1)+" 2ndsucc "+str(who_sent_message%MAX_NODES)+" pred "+str(who_sent_message)+ " succ "+str(-1)+" 2ndsucc "+str(who_sent_message)
								one_way_comm(own_node,own_node.succ_p,new_message) 
							except socket.error:
								pass

							own_node.second_succ_k = own_node.succ_k
							own_node.second_succ_p = own_node.succ_p
							own_node.succ_k = who_sent_message%MAX_NODES
							own_node.succ_p = who_sent_message
							conn_port.close()
				##########pred's update#########
				elif who_sent_message%MAX_NODES<int(own_node.key): #you know a port bigger than you
					if own_node.succ_k == own_node.key and own_node.pred_k==own_node.key: 			#own port was a single node in the network
						own_node.succ_k=who_sent_message%MAX_NODES
						own_node.succ_p=who_sent_message
						own_node.pred_k=who_sent_message%MAX_NODES
						own_node.pred_p=who_sent_message
						new_message = "pred " + str(own_node.key) + " succ1 " +str(own_node.key)+" 2ndsucc "+str(own_node.succ_k)+" pred "+str(own_node.port)+ " succ "+str(own_node.port)+" 2ndsucc "+str(own_node.succ_p)	
						conn_port.send(new_message)
						conn_port.close()
						if own_node.pred_p!=own_node.port:
							distribute_files(own_node)									#send pred all files that would now belong to it
					else:
						if own_node.pred_k < own_node.key:
							if who_sent_message%MAX_NODES > own_node.pred_k:
								new_message = "pred " + str(own_node.pred_k) + " succ1 " +str(own_node.key)+" 2ndsucc "+str(own_node.succ_k)+" pred "+str(own_node.pred_p)+ " succ "+str(own_node.port)+" 2ndsucc "+str(own_node.succ_p)	
								conn_port.send(new_message)
								conn_port.close()

								try:
									new_message = "pred " + str(-1) + " succ " +str(who_sent_message%MAX_NODES)+" 2ndsuccX "+str(own_node.key)+" pred "+str(-1)+ " succ "+str(who_sent_message)+" 2ndsucc "+str(own_node.port)	
									one_way_comm(own_node,own_node.pred_p,new_message) 
								except socket.error:
									pass

								own_node.pred_k = who_sent_message%MAX_NODES
								own_node.pred_p = who_sent_message
								# conn_port.close()
								if own_node.pred_p!=own_node.port:
									distribute_files(own_node)									#send pred all files that would now belong to it

							else:
								max_less_than_you_k=-1
								max_less_than_you_p=-1
								for i in range(finger_len):
									if own_node.finger[0][i]<=(who_sent_message%MAX_NODES) and own_node.finger[0][i]>max_less_than_you_k:
										max_less_than_you_k = own_node.finger[1][i]
										max_less_than_you_p = own_node.finger[2][i]
										print "best choice",own_node.finger[1][i]

								if max_less_than_you_k==-1:
									max_less_than_you_k = own_node.finger[1][finger_len-1]
									max_less_than_you_p = own_node.finger[2][finger_len-1]
								
								# print "connect to ",max_less_than_you_p
								conn_port.send("connect " + str(max_less_than_you_p) + " "+ str(max_less_than_you_k))
								conn_port.close()

						elif own_node.pred_k > own_node.key:
							new_message = "pred " + str(own_node.pred_k) + " succ1 " +str(own_node.key)+" 2ndsucc "+str(own_node.succ_k)+" pred "+str(own_node.pred_p)+ " succ "+str(own_node.port)+" 2ndsucc "+str(own_node.succ_p)	
							conn_port.send(new_message)
							conn_port.close()

							try:
								new_message = "pred " + str(-1) + " succ " +str(who_sent_message%MAX_NODES)+" 2ndsucc "+str(own_node.key)+" pred "+str(-1)+ " succ "+str(who_sent_message)+" 2ndsucc "+str(own_node.port)	
								one_way_comm(own_node,own_node.pred_p,new_message)
							except socket.error:
								pass

							if own_node.pred_p== own_node.succ_p:		 #if now there are 3 nodes in total, after join
								own_node.second_succ_p = who_sent_message
								own_node.second_succ_k= who_sent_message%MAX_NODES

							own_node.pred_p = who_sent_message
							own_node.pred_k = who_sent_message%MAX_NODES
							if own_node.pred_p!=own_node.port:
								distribute_files(own_node)									#send pred all files that would now belong to it

def listen4connections(own_node):	#thread for if anyone wants to send a message
	listensock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	listensock.bind((ip,int(own_node.port)))
	listensock.listen(MAX_NODES)
	while True:
		conn_port, addr = listensock.accept()
		thread.start_new_thread(listen4messages,(conn_port, addr, own_node))

def refresh(own_node):	#check repeatedly if succ is alive 
	while True:
		time.sleep(1.0)
		try:
			temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			temp.connect((ip, own_node.succ_p))
			check_message = "give_succ" 
			temp.send(check_message)
			data = temp.recv(1024)
		
		except socket.error:								#succ not alive, update
			who_left_k = own_node.succ_k
			who_left_p = own_node.succ_p

			own_node.succ_k = own_node.second_succ_k
			own_node.succ_p = own_node.second_succ_p
			if own_node.succ_p == own_node.port:
				own_node.pred_p = own_node.succ_p
				own_node.pred_k = own_node.succ_k

			if own_node.port!=own_node.succ_p: 				#not only node left
				try: 
					temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)					#get new second succ
					temp.connect((ip, own_node.succ_p))
					new_message_x = "give_succ"
					temp.send(new_message_x)
					data = temp.recv(1024)
					temp.close()
					data= data.split()
					if data[0] == "mysucc":
						own_node.second_succ_k = int(data[1])
						own_node.second_succ_p = int(data[2])
					 
					new_message_x = "pred " + str(own_node.key) + " succ " + str(-1) + " 2ndsucc " + str(-1) + " pred " + str(own_node.port) + " succ " + str(-1) + " 2ndsucc " + str(-1)   
					one_way_comm(own_node,own_node.succ_p,new_message_x) #tell succ that i am its new pred
				except socket.error:
					pass

			if own_node.port!=own_node.pred_p: 
				try: 
					new_message_x = "pred " + str(-1) + " succ " + str(-1) + " 2ndsucc " + str(own_node.succ_k) + " pred " + str(-1) + " succ " + str(-1) + " 2ndsucc " + str(own_node.succ_p)  
					one_way_comm(own_node,own_node.pred_p,new_message_x) #tell pred to change 2ndsucc
				except socket.error:
					pass

			for i in range(finger_len):
				if own_node.finger[2][i] == who_left_p:
					own_node.finger[1][i] = own_node.succ_k
					own_node.finger[2][i] = own_node.succ_p
			try:
				leaving_message = "leaving " + str(who_left_k) + " " + str(who_left_p) + " new " + str(own_node.succ_k) + " " + str(own_node.succ_p) + " " + str(own_node.port)
				one_way_comm(own_node,own_node.pred_p,leaving_message) 	#circular notification to leave
			except socket.error:
				pass

def leave(own_node):	#transfer all your files to succ and tell pred to update finger table in chain. Also tells succ and pred and pred's pred to update
	if own_node.succ_p!=own_node.port:
		print "\nSending all my files to",own_node.succ_k, "before leaving"
		for file in own_node.files:			#transfer all files to successor	
			try:
				temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
				temp.connect((ip, own_node.succ_p))
				temp.send("sending "  + str(file) + " " + str(own_node.port) + " "+str(own_node.key))
				response = temp.recv(1024)
				if response=="proceed":
					f = open(file, 'rb')
					line = f.read(1048576)
					while(line):
						temp.send(line)
						line= f.read(1048576)
				temp.close()
			except socket.error:
				pass

	if own_node.port!=own_node.succ_p:
		try:
			new_message = "pred " + str(own_node.pred_k) + " succ " + str(-1) + " 2ndsucc " + str(-1) + " pred " + str(own_node.pred_p) + " succ " + str(-1) + " 2ndsucc " + str(-1)
			one_way_comm(own_node,own_node.succ_p,new_message) #succ will update its pred
		except socket.error:
			pass

	if own_node.port!= own_node.pred_p:
		try: 
			new_message = "pred " +str(-1) + " succ "+ str(own_node.succ_k) + " 2ndsuccX " + str(own_node.second_succ_k) + " pred " +str(-1) + " succ "+ str(own_node.succ_p) + " 2ndsuccX " + str(own_node.second_succ_p)
			one_way_comm(own_node,own_node.pred_p,new_message) #pred will update its succ and pred's pred will check succX and update its second suc
		except socket.error:
			pass

	try: 
		new_message = "leaving " + str(own_node.key) + " " + str(own_node.port) + " new " + str(own_node.succ_k) + " " + str(own_node.succ_p) + " "  + str(-1)
		one_way_comm(own_node,own_node.pred_p,new_message) #tell everyone to update finger table
	except socket.error:
		pass

	print "YOU LEFT THE NETWORK"
def put_file(own_node,filename):
	hash_object = hashlib.sha1(filename)
	filekey = int(hash_object.hexdigest() , 16)%MAX_NODES
	print "\nPUTFilekey",filekey
	if filekey>own_node.key:
		if own_node.succ_p ==own_node.port and own_node.pred_p ==own_node.port:
			print "I will keep file",filename
			own_node.files.append(filename)
		else:
			if own_node.succ_k>own_node.key:
				if filekey<own_node.succ_k:
					try:																				#send to successor
						temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
						temp.connect((ip, own_node.succ_p))
						temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key)+ " " + str(own_node.succ_p))
						response = temp.recv(1024)
						if response=="proceed":
							f = open(filename, 'rb')
							line = f.read(1048576)
							while(line):
								temp.send(line)
								line= f.read(1048576)
						temp.close()
						print "\nFile Transfer Complete For", filename, "to", own_node.succ_p
					except socket.error:
						print "Couldn't send file", filename, "to", own_node.succ_k
						pass
				else:
					try:																				#FIND IN FINGER TABLE
						max_less_than_you_k=-1
						max_less_than_you_p=-1
						check2=False
						key = -1
						for i in range(finger_len):
							# print "FILE: now checking for",own_node.finger[0][i]						#check for a close match
							if own_node.finger[0][i]<=filekey and own_node.finger[0][i]>=key:
								key= own_node.finger[0][i]
								max_less_than_you_k = own_node.finger[1][i]
								max_less_than_you_p = own_node.finger[2][i]

						# print "FILE: closest match:", key, max_less_than_you_k, max_less_than_you_p
						if max_less_than_you_k==-1:														#if no close match found
							max_less_than_you_k = own_node.finger[1][finger_len-1]
							max_less_than_you_p = own_node.finger[2][finger_len-1]
							key = own_node.finger[0][finger_len-1]
							check2=True
						if max_less_than_you_k>=filekey and check2==False:												#if you found a match				
							pass
						else:
							temp2=socket.socket(socket.AF_INET, socket.SOCK_STREAM)															#send get_succ request
							temp2.connect((ip, max_less_than_you_p))
							new_message = "get_succ " + str(filekey) + " " + str(own_node.port)
							temp2.send(new_message)
							found_it2 = temp2.recv(1024)
							temp2.close()
							found_it2 = found_it2.split()
							max_less_than_you_k = int(found_it2[1])
							max_less_than_you_p = int(found_it2[2])

						print "Sending the File to Port:", max_less_than_you_p							#send the file to the appropriate node
						temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
						temp.connect((ip, max_less_than_you_p))
						temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key)+ " " + str(max_less_than_you_p))
						response = temp.recv(1024)
						if response=="proceed":
							f = open(filename, 'rb')
							line = f.read(1048576)
							while(line):
								temp.send(line)
								line= f.read(1048576)
						temp.close()
						print "\nFile Transfer Complete For", filename, "to", max_less_than_you_k
					except socket.error:
						print "Couldn't send the file",filename, "to",max_less_than_you_k
						pass

			elif own_node.succ_k<own_node.key:
				try:
					temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
					temp.connect((ip, own_node.succ_p))
					temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key)+ " " + str(own_node.succ_p))
					response = temp.recv(1024)
					if response=="proceed":
						f = open(filename, 'rb')
						line = f.read(1048576)
						while(line):
							temp.send(line)
							line= f.read(1048576)
					temp.close()
					print "\nFile Transfer Complete For", filename, "to", own_node.succ_k	
				except socket.error:
					print "Couldn't send file", filename, "to", own_node.succ_k
					pass
	
	elif filekey<=own_node.key:
		if own_node.succ_p==own_node.port and own_node.pred_p==own_node.port:
			print "I will keep file", filename
			own_node.files.append(filename)

		else:
			if own_node.pred_k<own_node.key:
				if filekey>own_node.pred_k:
					print "I will keep file", filename
					own_node.files.append(filename)
					print "Replicate at successor"
					try:																				#send to successor
						temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
						temp.connect((ip, own_node.succ_p))
						temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key))
						response = temp.recv(1024)
						if response=="proceed":
							f = open(filename, 'rb')
							line = f.read(1048576)
							while(line):
								temp.send(line)
								line= f.read(1048576)
						temp.close()
						print "\nFile Transfer Complete For", filename, "to", own_node.succ_k
					except socket.error:
						print "Couldn't replicate file", filename, "to", own_node.succ_k
						pass
				else:
					try:																				#FIND IN FINGER TABLE
						max_less_than_you_k=-1
						max_less_than_you_p=-1
						key = -1
						for i in range(finger_len):
							# print "PUTFILE: now checking for",own_node.finger[0][i]						#check for a close match
							if own_node.finger[0][i]<=filekey and own_node.finger[0][i]>=key:
								key= own_node.finger[0][i]
								max_less_than_you_k = own_node.finger[1][i]
								max_less_than_you_p = own_node.finger[2][i]

						# print "PUTFILE: closest match:", key, max_less_than_you_k, max_less_than_you_p
						check1=False
						if max_less_than_you_k==-1:														#if no close match found
							max_less_than_you_k = own_node.finger[1][finger_len-1]
							max_less_than_you_p = own_node.finger[2][finger_len-1]
							key = own_node.finger[0][finger_len-1]
							check1=True
						if max_less_than_you_k>=filekey and check1==False:								#if you found a match				
							pass
						else:
							temp2=socket.socket(socket.AF_INET, socket.SOCK_STREAM)						#send get_succ request
							temp2.connect((ip, max_less_than_you_p))
							new_message = "get_succ " + str(filekey) + " " + str(own_node.port)
							temp2.send(new_message)
							found_it2 = temp2.recv(1024)
							temp2.close()
							found_it2 = found_it2.split()
							max_less_than_you_k = int(found_it2[1])
							max_less_than_you_p = int(found_it2[2])

						print "Sending the File to Port:", max_less_than_you_p							#send the file to the appropriate node
						temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
						temp.connect((ip, max_less_than_you_p))
						temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key) + " " + str(max_less_than_you_p))
						response = temp.recv(1024)
						if response=="proceed":
							f = open(filename, 'rb')
							line = f.read(1048576)
							while(line):
								temp.send(line)
								line= f.read(1048576)
						temp.close()
						print "\nFile Transfer Complete For", filename, "to", max_less_than_you_k
					except socket.error:
						pass

			elif own_node.pred_k>own_node.key:
				print "I will keep file",filename
				own_node.files.append(filename)
				print "Replicate at successor"
				try:																				#send to successor
					temp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
					temp.connect((ip, own_node.succ_p))
					temp.send("sending "  + str(filename) + " " + str(own_node.port) + " "+str(own_node.key))
					response = temp.recv(1024)
					if response=="proceed":
						f = open(filename, 'rb')
						line = f.read(1048576)
						while(line):
							temp.send(line)
							line= f.read(1048576)
					temp.close()
				except socket.error:
					print "Couldn't replicate file", filename, "to", own_node.succ_k
					pass 

def get_file(own_node, filename):
	hash_object = hashlib.sha1(filename)
	filekey = int(hash_object.hexdigest() , 16)%MAX_NODES
	print "GETFilekey:",filekey

	if own_node.pred_k==own_node.key: #single node in network
		pass
	elif (own_node.pred_k>own_node.key and filekey>own_node.pred_k) or (filekey<=own_node.key and filekey>own_node.pred_k):
		print "You should already have the file"
	elif own_node.succ_k>own_node.key and filekey<=own_node.succ_k and filekey>own_node.key:
		try: #get from succ
			siz=0
			if os.path.isfile(str(filename)):
				siz = os.path.getsize(filename)

			temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			temp.connect((ip,own_node.succ_p))
			temp.send("sendfile " + str(filename) + " " + str(own_node.key) + " " + str(own_node.port)+ " " +str(siz))
			answer = temp.recv(1024)
			if answer=="proceed":
				if siz==0:
					file = open(filename, 'wb')
					line = temp.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					file.close()
					own_node.files.append(filename)
					print "Got File:", filename
				else:
					file = open(filename,'ab')
					line = temp.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					file.close()
					own_node.files.append(filename)
					print "Got File:", filename
			temp.close()
		
		except socket.error:
			pass

	elif own_node.succ_k<own_node.key and (filekey>own_node.key or filekey<=own_node.succ_k): #EXAMPLES: me=6 filekey=7 succ=1 || me=6 filekey=0 succ=1 
		try: #get from succ
			siz=0
			if os.path.isfile(str(filename)):
				siz = os.path.getsize(filename)

			temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			temp.connect((ip,own_node.succ_p))
			temp.send("sendfile " + str(filename) + " " + str(own_node.key) + " " + str(own_node.port) + " " + str(siz))
			answer = temp.recv(1024)
			if answer=="proceed":
				if siz==0:
					file = open(filename, 'wb')
					line = temp.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					own_node.files.append(filename)
					file.close()
					print "Got file:", filename
				else:
					file = open(filename,'ab')
					line = conn_port.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					file.close()
					own_node.files.append(filename)
					print "Got file:", filename
			temp.close()
		
		except socket.error:
			pass
	else:																					#check who the file belongs to and request it from that node
		try:																				#FIND IN FINGER TABLE
			
			siz=0
			if os.path.isfile(str(filename)):
				siz = os.path.getsize(filename)

			max_less_than_you_k=-1
			max_less_than_you_p=-1
			key = -1
			check_file=False
			for i in range(finger_len):
				print "GETFILE: now checking for",own_node.finger[0][i]						#check for a close match
				if own_node.finger[0][i]<=filekey and own_node.finger[0][i]>=key:
					key= own_node.finger[0][i]
					max_less_than_you_k = own_node.finger[1][i]
					max_less_than_you_p = own_node.finger[2][i]

			print "GETFILE: closest match:", key, max_less_than_you_k, max_less_than_you_p
			if max_less_than_you_k==-1:														#if no close match found
				max_less_than_you_k = own_node.finger[1][finger_len-1]
				max_less_than_you_p = own_node.finger[2][finger_len-1]
				key = own_node.finger[0][finger_len-1]
				check_file=True

			if max_less_than_you_k>=filekey and check_file==False:												#if you found a match				
				pass
			else:
				temp2=socket.socket(socket.AF_INET, socket.SOCK_STREAM)														#send get_succ request
				temp2.connect((ip, max_less_than_you_p))
				new_message = "get_succ " + str(filekey) + " " + str(own_node.port)
				temp2.send(new_message)
				found_it2 = temp2.recv(1024)
				temp2.close()
				found_it2 = found_it2.split()
				max_less_than_you_k = int(found_it2[1])
				max_less_than_you_p = int(found_it2[2])
		except socket.error:
			pass
		
		try:
			temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			temp.connect((ip,max_less_than_you_p))
			temp.send("sendfile " + str(filename) + " " + str(own_node.key) + " " + str(own_node.port) + " " + str(siz))
			answer = temp.recv(1024)
			if answer=="proceed":
				if siz==0:
					file = open(filename, 'wb')
					line = temp.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					own_node.files.append(filename)
					print "Got File:", filename
				else:
					file = open(filename,'ab')
					line = conn_port.recv(1048576)
					while (line):
						file.write(line)
						line= temp.recv(1048576)
					file.close()
					own_node.files.append(filename)
					print "Got File:", filename
			temp.close()
			
		except socket.error:
			pass 

def userInput(own_node):
	global end
	while True:
		print "\nEnter 1 for neighbours"
		print "Enter 2 for leaving"
		print "Enter 3 for uploading file"
		print "Enter 4 for downloading file"
		print "Enter 5 for finger table"
		print "Enter 6 for viewing files"
		ui = raw_input("Your choice: ")
		if int(ui)==1:
			print "\nYou_p:",own_node.port," You_k:",own_node.key
			print "Pred_p:",own_node.pred_p," Pred_k:",own_node.pred_k
			print "Succ_p:",own_node.succ_p," Succ_k:",own_node.succ_k
			print "2ndsucc_p:", own_node.second_succ_p," 2ndsucc_k:", own_node.second_succ_k,"\n"
		
		elif int(ui)==2:
			leave(own_node)
			end=True
			os._exit(0)

		elif int(ui)==3:
			filename = raw_input("Enter Filename: ")
			if os.path.isfile(str(filename)):
				put_file(own_node,filename)
			else:
				print "You don't have that file :("
		
		elif int(ui)==4:
			filename = raw_input("Enter Filename: ")
			if filename in own_node.files:
				print "You already have the file"
			else:
				get_file(own_node,filename)		
		
		elif int(ui)==5:
			print "\n---------------------------"
			print "         FINGER TABLE"
			print "---------------------------"
			for i in range(int(math.log(MAX_NODES,2.0))):
				print "Key:",own_node.finger[0][i]," Val:",own_node.finger[1][i]," Port:",own_node.finger[2][i] 
			print "---------------------------"
		
		elif int(ui)==6:
			if own_node.files!=[]:
				print"\nYOUR FILES:"
				for i in range(len(own_node.files)):
					print i+1,". ",own_node.files[i]
			else:
				print"\nYou don't have any files"
		
		else:
			print "\nInvalid Command" #thread for user input

def Main(port):
	own_node = Node(port)
	net_port = raw_input("If you know another node, enter its port. Else enter -1:   ")
	thread.start_new_thread(listen4connections,(own_node,))
	thread.start_new_thread(userInput,(own_node,))
	thread.start_new_thread(refresh, (own_node,))
	while True:
		if int(net_port)!=-1: 
			try:
				mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
				mysock.connect((ip,int(net_port)))
				mysock.send(str(own_node.port) + " join")
			except:
				print "couldnt send join req to network"
				break

			if end==True:
				break

			while True:
				try:
					message = mysock.recv(1024)
				except socket.error:
					# print "error"
					break

				if message!="":
					message= message.split()
						
					if message[0] == "pred":								#FORMAT: pred 0 succ 2 2ndsucc 4 pred 8000 succ 8002 2ndsucc 8004
						# print "innn"
						if int(message[1])!=-1 and int(message[7])!=-1:
							own_node.pred_k = int(message[1])
							own_node.pred_p = int(message[7])
						
						if int(message[3])!=-1 and int(message[9])!=-1:
							own_node.succ_k = int(message[3])
							own_node.succ_p = int(message[9])
							own_node.finger[1][0] = own_node.succ_k
							own_node.finger[2][0] = own_node.succ_p
							for i in range(finger_len):
								if own_node.succ_k<own_node.key:
									if own_node.finger[0][i]>own_node.key:
										own_node.finger[1][i] = own_node.succ_k
										own_node.finger[2][i] = own_node.succ_p

								if own_node.succ_k>=own_node.finger[0][i]:
									if own_node.finger[0][i]<own_node.key:
										pass
									else:
										if own_node.finger[1][i]==own_node.key:			#added later for reverse situations. eg 1 knows 5 
											own_node.finger[1][i]=own_node.succ_k
											own_node.finger[2][i]=own_node.succ_p

									if own_node.finger[1][i]>own_node.succ_k:
										own_node.finger[1][i]= own_node.succ_k
										own_node.finger[2][i]= own_node.succ_p

							try:
								for i in range(1,finger_len):
									# print "inside succ1",i, own_node.pred_k, own_node.succ_k, own_node.second_succ_k
									if own_node.finger[2][i]==own_node.port and own_node.pred_p!=own_node.succ_p:
										# print "get successor for", own_node.finger[0][i]
										temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
										temp.connect((ip, int(own_node.finger[2][i-1])))
										new_message = "get_succ " + str(own_node.finger[0][i]) + " " + str(own_node.key)
										temp.send(new_message)
										found_it = temp.recv(1024)
										found_it = found_it.split()
										own_node.finger[1][i] = int(found_it[1])
										own_node.finger[2][i] = int(found_it[2])
										temp.close()
							except socket.error:
								print "couldnt get succ"

						if int(message[5])!=-1 and int(message[11])!=-1:
							own_node.second_succ_k = int(message[5])
							own_node.second_succ_p= int(message[11])
						
						if message[4]=="2ndsuccX":	#tell your predecessor to update 2nd succ
							new_message = "pred " + str(-1)  +" succ "+ str(-1) + " 2ndsucc " + str(own_node.succ_k)+ " pred "+ str(-1)+" succ "+str(-1) +" 2ndsucc "+str(own_node.succ_p)
							try:
								one_way_comm(own_node,own_node.pred_p,new_message)
							except socket.error:
								pass

						if message[2]=="succ1":
							try:
								for i in range(1,finger_len):
									# print "inside succ1",i, own_node.pred_k, own_node.succ_k, own_node.second_succ_k
									if own_node.finger[2][i]==own_node.port and own_node.second_succ_p!=own_node.port:
										# print "get successor for", own_node.finger[0][i]
										temp=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
										temp.connect((ip, int(own_node.finger[2][i-1])))
										new_message = "get_succ " + str(own_node.finger[0][i]) + " " +str(own_node.key)
										temp.send(new_message)
										found_it = temp.recv(1024)
										found_it = found_it.split()
										own_node.finger[1][i] = int(found_it[1])
										own_node.finger[2][i] = int(found_it[2])
										temp.close()
							except socket.error:
								pass

						try:
							new_message = "update_finger " + str(own_node.key) + " "+ str(own_node.port) 
							one_way_comm(own_node,own_node.pred_p,new_message)	
						except socket.error:
							pass
						# mysock.close()
					elif message[0]== "connect":								#FORMAT: connect 8002 2
						# print "got connect message from",message[1], message[2]
						mysock.close()
						mysock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
						mysock.connect((ip, int(message[1])))						
						mysock.send(str(own_node.port) + " join")
					
if __name__ == '__main__':
	Main(sys.argv[1])