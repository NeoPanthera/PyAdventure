from random import randint
import random

class Player(object):

    def __init__(self, name):
        self.name = name
        self.weapon = "Unarmed"
        self.inventory = []
        self.status = "Normal"

player = Player("John")

class Item(object):
	
	def __init__(self, name):
		self.name = name
	
	def __repr__(self):
		return self.name
	
	def __str__(self):
		return self.name
	#Name
	#Description
	#Pick up

class Equipment(object):
	pass
	
class Status(object):
	pass
	
	
class Scene(object):
	
	def __init__(self):
		self.play()
	
	def play(self):
		print "Oops, you should override this scene's play method!"
	
		#Choose Event():
		#show Options
		#Check Equipment
class River(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You walk a dirt road until you come across the river."
		print "The bridge for the river is blocked by a toll booth."
		print "The guard in the booth asks you politely for $20 to pass the toll."
		print "Will you jump the gate, swim across the river, or pay the toll?"
		action = raw_input("> ")
		if "jump" in action:
			self.jump()
		
			
	def jump(self):
		print "You get a running start to jump over the gate!"
			print "The guard flashes out of the booth in front of you, stopping your assault on the law."
			print "\"Yo, that's not cool, man. What are you doing?\""
			print "Will you explain the situation or fight the guard?"
			action = raw_input("> ")
			if "explain" in action: 
				self.explain()
			else:
				self.guard_fight()
	
	def explain(self):
		print "You explain the situation of the letter to the guard."
		guard_explain = random.randint(1,10)
		if guard_explain <= 5:
			print "\"Yeah, man. I can totally relate to that. Alright, I'll let you through, but don't tell my boss.\""
			print "The guard pulls a lever in the booth and the gate rises. You strut onward as the guard waves you off."
			Shop()
		else:
			print "\"Yo, that's some bull right there. I don't believe you. Either pay the toll or get out. Don't MAKE me use my taser\"!"
			print "Will you fight the guard, swim across the river, or pay the toll?"
			action = raw_input("> ")
			if "pay" in action: 
				self.pay_toll()
			elif "swim" in action:
				self.swim_river()
				
			else:
				self.guard_fight()
						
	def guard_fight(self):
		print "\"Ah hell nah, it is ON!\""
		print "The guard whips out his weapon of choice: his stun gun"
		kombat = random.randint(1,10)
		if (kombat <= 7 and player.weapon == "Unarmed") or (kombat <= 3 and player.weapon == "Armed"):
			print "The guard nimbly stabs you with his charged stun gun."
			print "You shudder and fall to the ground in one spasmodic motion."
			print "..."
			print "You wake up back at the fork in the road to find the road to the river is walled off."
			has_been_tased = Status(name = "Tased")
			player.inventory.append(has_been_tased)
			Forest()
			
	def swim_river(self):
		print "You step away from the guard and approach the river."
		print "You inhale a deep breath and dive into the river!"
		swim = random.randint(1, 10)
		if swim <= 2:
			print "You come up for air then begin swimming across the river"
			weapon_find = random.randint(1, 10)
			if weapon_find >= 4:
				print "As you swim, you feel something hit your foot."
				
			
	
	def pay_toll(self):
	
							
						
							
							
class Forest(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You walk into a dense forest. The air around you feels richer from the amount of trees."
		print "After a fair amount of trekking through the thicket, your keen senses spot a $20 bill pinned to a tree."
		if "has_been_tased" in player.status:
			print "You remove the money from the tree and keep going"
			self.keep_going()
		else:
			print "You remove the money from the tree. Would you like to go back to the river or keep going?"
			action = raw_input("> ")
			if "river" in action:
				print "You decide to head back to the river!"
				River()
			elif "going" in action:
				self.keep_going()
			
	def keep_going(self):	
		print "You decide to keep going"
		print "After more walking through the forest, you discover a wild rabbit!"
		print "Do you attack it or leave it alone and continue?"
		rabbit_action = False
			
		while True:		
			action = raw_input("> ")
			if "attack" in action:
				self.attack_rabbit()
				
			elif "leave" in action:
				print "You leave the rabbit alone and continue your adventure through the forest."
				rabbit_action = True
				self.post_rabbit()
			else:
				print "I'm sorry, what was that?"		
				
	def attack_rabbit(self):
		print "You attack the rabbit!"
		rabbit_action = True
		escape = random.randint(1,10)
		if escape <= 3:
			print "The rabbit has escaped! That's too bad."
		else:
			print "You have slain the rabbit! Nice job!"
			rabbit = Item(name = "Rabbit")
			player.inventory.append(rabbit)
			
		print "You continue your adventure through the forest"
		self.post_rabbit()		
				
	def post_rabbit(self):	
		lost = random.randint(1,10)
		if lost <= 2:
			print "You get lost in the woods and never find your way out."
			Death()
		else:
			print "You made it out of the forest! You see a small shop up ahead."
			Shop()
			
				
					
				
		
class Shop(Scene):
	
	def enter(self):
		pass
		
		
class BusRide(Scene):
	
	def enter(self):
		pass
		
		
class Cave(Scene):
	
	def enter(self):
		pass
		
		
class DarkPalace(Scene):
	
	def enter(self):
		pass
		
		
class Death(Scene):
	
	def enter(self):
		pass
		
		
class Victory(Scene):
	
	def enter(self):
		pass
		
	

class Events(object):
	#Show Options
	pass

class NPCs(object):
	pass



		
def Letter():
	print "You're walking through the meadow, enjoying the time to yourself."
	print "You see a glimmer in the distance. You squint to try and figure out what it is."
	print "Oh, it's the mail man! Looks like he's here to deliver a letter to you."
	print " 'Sir! What is your name?' "
	name = raw_input("> ")
	print " 'I thought you were %s! Excellent, I have this letter for you then!' " % name
	print "He hands you a letter. You look down at it, then back up at the mail man."
	print "He has already run off in the opposite direction. Well, a mail man's job is never done."
	print "You open the letter..."
	print " 'Dear %s, the Evil Wizard has taken over the Palace. You have been chosen to defeat the Evil Wizard and save the world.' " % name
	print "You realize that you must defeat the Evil Wizard and save the world."
	print " 'I'm going on an adventure!' "
	Intersection1()

def Intersection1():
	print "You continue upon the path until you reach a fork in the road."
	print "The sign on the left side says Forest Ahead. The sign on the right side says River Ahead."
	print "Will you go through the forest or the river?"
	path_taken = False 
	
	while True:
		path1 = raw_input("> ")
		if path1 == "forest":
			print "The forest it is then!"
			path_taken = True
			Forest()
		elif path1 == "river":
			print "The river it is then!"
			path_taken = True
			River()
		else:
			print "Wait, which path?"	



Letter()