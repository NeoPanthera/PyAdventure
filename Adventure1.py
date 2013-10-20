from random import randint
from random import choice
import random
import sys

class Player(object):

    def __init__(self):
		self.name = "John"
		self.weapon = "fists"
		self.weapon_equip = "Unarmed"
		self.inventory = {}
		self.status = {}
		self.hp = 2

player = Player()
weapon_list = ['dagger', 'gun', 'sword', 'magical staff', 'lance', 'spinning axe', 'crossbow and quiver', 'iron gauntlets']

class Wizard(object):
	
	def __init__(self):
		self.hp = 4

wizard = Wizard()

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
	
	
class Scene(object):
	
	def __init__(self):
		self.play()
	
	
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
		elif "swim" in action:
			self.swim_river()
		else:
			self.pay_toll()
		
			
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
			print "\"Yo, that's some bull right there. I don't believe you. Either pay the toll or get out. Don't MAKE me use my taser!\""
			player.status["failed_explain"] = True
			if "failed_pay" in player.status:
				print "Will you fight the guard, swim across the river, or go to the forest?"
				if "swim" in action:
					self.swim_river()
				elif "forest" in action:
					self.to_forest()
				else:
					self.guard_fight()
			else:
				print "Will you fight the guard, swim across the river, go to the forest, or pay the toll?"
				action = raw_input("> ")
				if "pay" in action: 
					self.pay_toll()
				elif "swim" in action:
					self.swim_river()
				elif "forest" in action:
					self.to_forest()
				else:
					self.guard_fight()
						
	def guard_fight(self):
		print "\"Ah hell nah, it is ON!\""
		print "The guard whips out his weapon of choice: his stun gun"
		Delay()
		kombat = random.randint(1,10)
		if kombat <= 7:
			print "The guard nimbly stabs you with his charged stun gun."
			print "You shudder and fall to the ground in one spasmodic motion."
			print "..."
			print "You wake up back at the fork in the road to find the road to the river is walled off."
			player.status["has_been_tased"] = True
			Forest()
		else:
			print "The guard nimbly lunges at you with his stun gun."
			print "With the use of your heroic senses, you dodge the attack and the guard lunges past you!"
			print "After the dodge, you elbow the guard in the back of the head and he faints."
			print "With the guard unconscious, you hop over the gate and continue forward."
			Shop()
			
			
	def swim_river(self):
		print "You step away from the guard and approach the river."
		print "You inhale a deep breath and jump into the river!"
		swim = random.randint(1, 10)
		if swim <= 2:
			print "You come up for air then begin swimming across the river"
			weapon_find = random.randint(1, 10)
			if weapon_find <= 4:
				print "As you swim, you feel something hit your foot."
				print "You dive underneath the water..."
				weapon = choice(weapon_list)
				print "You got the %s!" % weapon
				player.weapon = weapon
				player.weapon_equip = "Armed"
				print "You put away your weapon and continue swimming across the river."
				print "You finally reach the other end of the river."
				print "You climb out and whip your hair back and forth to dry off."
				print "After drying off, you spot a small shop in the distance."
				Shop()
			else:
				print "You are doing well in your journey across the river."
				print "You finally reach the other end of the river."
				print "You climb out and whip your hair back and forth to dry off."
				print "After drying off, you spot a small hut in the distance."
				Shop()
		else:
			print "When you dive into the water, your head smashes into a rock and your skull implodes."
			Death()
	
	def pay_toll(self):
		print "You decide to pay the toll to cross the bridge."
		if "20 dollars" in player.inventory:
			print "You reach into your pocket and pull out the $20 from the forest."
			print "You hand the money to guard and he pulls a lever in the booth to raise the gate."
			print "You continue onward as the guard waves you off."
			del player.inventory["20 dollars"]
			Shop()
		else:
			print "You reach into your pocket and, to your dismay, find no money."
			player.status["failed_pay"] = True
			if "failed_explain" in player.status:
				print "Would you like to go to the forest instead or just swim across the river?"
				if "forest" in action:
					self.to_forest()
				else:
					self.jump()
			else:
				print "Would you like to go to the forest instead, jump the gate, or swim across the river?"						
				action = raw_input("> ")
				if "forest" in action:
					self.to_forest()
				elif "jump" in action:
					self.jump()
				else:
					self.swim_river()
				
	def to_forest(self):
		print "After exploring your options, you decide to simply go to the forest instead."
		Forest()
							
							
class Forest(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You walk into a dense forest. The air around you feels richer from the amount of trees."
		print "After a fair amount of trekking through the thicket, your keen senses spot a $20 bill pinned to a tree."
		player.inventory["20 dollars"] = True
		if "has_been_tased" in player.status:
			print "You remove the money from the tree and keep going"
			self.keep_going()
		else:
			print "You remove the money from the tree. Would you like to go back to the river or keep going?"
			action = raw_input("> ")
			if "river" in action:
				print "You decide to head back to the river!"
				River()
			elif "going" or "keep" in action:
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
			player.inventory["Rabbit"] = True
			
		print "You continue your adventure through the forest"
		self.post_rabbit()		
				
	def post_rabbit(self):	
		lost = random.randint(1,10)
		if lost <= 2:
			print "You get lost in the woods and never find your way out."
			Death()
		else:
			print "You made it out of the forest! You see a small hut up ahead."
			Shop()
			
				
					
				
		
class Shop(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You stride up to a lone hut on the dirt road."
		print "A small man in the hut spots you and jumps up."
		print "\"Hello! Welcome to my humble shop! \""
		print "\"I have this one-way bus ticket to the Palace.\""
		print "\"I also have this magma armor on sale. Take your pick!\""
		shop_purchase = False
			
		while True:
			action = raw_input("> ")
			if "ticket" in action or "bus" in action:
				shop_purchase = True
				self.ticket()
			elif "armor" in action or "magma" in action:
				shop_purchase = True
				self.armor()
			else:
				print "\"I'm sorry, which one would you like?\""
		
	def ticket(self):
		if "20 dollars" in player.inventory:
			print "\"That will be 20 dollars for the bus ticket!\""
			del player.inventory["20 dollars"]
			player.inventory["Bus ticket"] = True
			self.after_purchase()
		else:
			print "\"Oh, you don't have any money on you.\""
			print "\"That\'s ok. I know you\'re the hero, so I\'ll let you have the bus ticket for free.\""
			player.inventory["Bus ticket"] = True
			self.after_purchase()
	
	def armor(self):
		if "20 dollars" in player.inventory:
			print "\"That will be 20 dollars for the magma armor!\""
			del player.inventory["20 dollars"]
			player.inventory["Magma armor"] = True
			self.after_purchase()	
		else:
			print "\"Oh, you don't have any money on you.\""
			print "\"That\'s ok. I know you\'re the hero, so I\'ll let you have the magma armor for free.\""
			player.inventory["Magma armor"] = True
			self.after_purchase()
			
	def after_purchase(self):
		print "\"Thank you for your business!\""
		if "Rabbit" in player.inventory and player.weapon_equip == "Unarmed":
			print "\"Oh, I see you have slain a rabbit.\""
			print "\"Trade me the rabbit and I'll give you a choice weapon in exchange!\""
			print "You hand the shopkeeper the rabbit and he hands you a chest."
			print "You open the chest..."
			weapon = choice(weapon_list)
			print "You got the %s!" % weapon
			player.weapon = weapon
			player.weapon_equip = "Armed"
		
		print "The shopkeeper wishes you good luck in the rest of your adventure."
		if "Bus ticket" in player.inventory:
			BusRide()
		else:
			Cave()
		
		
class BusRide(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You continue along the dirt road until you spot a bus stop."
		print "You sit down on a bench and the bus immediately arrives."
		print "You step onto the bus and hand the driver your ticket."
		print "You walk down the rows of seats and sit down next to a window."
		print "The bus resumes its course."
		wrong_bus = random.randint(1,10)
		if wrong_bus <= 2:
			print "You look out the window and immediately realize that the bus isn't leading to the Palace."
			print "You got on the wrong bus!"
			Death()
		else:
			print "You look out the window and realize how peaceful it is outside."
			print "As you wonder about the innate peace of nature, you start to doze off."
			print "After a stressful adventure, you fall asleep..."
			pickpocket = random.randint(1,10)
			if (pickpocket <= 3 and player.weapon_equip == "Armed"):
				print "As you rest, a thief on the bus pickpockets your weapon!"
				player.weapon_equip = "Unarmed"
				player.weapon = "fists"
			print "Press enter to continue!"
			awake = raw_input("> ")
			print "..."
			print "You wake up feeling Well Rested!"
			player.status["Well Rested"] = True
			print "As you stretch after a nice nap, you notice that you are nearing the Palace."
			print "When the bus reaches the stop, you step outside and thank the driver."
			DarkPalace()
			
			
			
		
		
class Cave(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "You spot a volcano behind the shop."
		print "That must be what the magma armor is for!"
		print "As you approach the volcano, you start to get a lot hotter, but you notice a small cave at the base."
		print "You equip the magma armor and head into the dark cave."
		print "You step into the cave and use the the light from the Sun as your guide."
		print "Suddenly, the cave collapses behind you!"
		print "After clearing the dust from your eyes, you realize the rockslide has blocked the entrance."
		print "With the sunlight no longer available to you, you must feel your way along the cave walls."
		trip_chance = random.randint(1,10)
		if trip_chance <= 5:
			print "As you feel across these dark walls, you stumble on a rock and fall to the ground."
			print "\"D'oh!\""
			print "You get back up but now you have a monster headache."
			player.status["Headache"] = True
			print "Rubbing your sore noggin, you keep going."
		print "Continuing through the cave, you see a source of light around the corner!"
		print "You scout the area and see a Lava Bear with a sunfiery pelt!"
		print "The bear spots you and charges!"
		Delay()
		bear_fight = random.random()
		armor_break = random.random()
		if "Headache" in player.status:
			bear_fight = bear_fight + .1
		if (bear_fight <= .5 and player.weapon_equip == "Armed"):
			print "With the help of your weapon and skill, you defeat the Lava Bear!"
			player.inventory["Sunfire Pelt"] = True
			self.cave_continue()
		elif (bear_fight <= .2 and player.weapon_equip == "Unarmed"):
			print "With your cunning skills, you defeat the Lava Bear!"
			player.inventory["Sunfire Pelt"] = True
			self.cave_continue()
		elif (armor_break <= .25):
			print "With mighty slash of its molten claws, the Lava Bear cleaves your armor off."
			del player.inventory["Magma armor"]
			print "Without the magma armor, your skin boils and your temperature rises until you ignite!"
			print "In 5 seconds, you burn to death."
			Death()
		else:
			print "The Lava Bear considers you weak and decides leaves you alone."
			print "Distraught, you continue through the cave."
			self.cave_continue()
			
	def cave_continue(self):
		if "Sunfire Pelt" in player.inventory:
			print "With the help of a nearby sharp stone edge, you slice the sunfirery pelt off the fallen Lava Bear."
			print "You decide the best way to carry the sunfire pelt is to use it as a cape to help traverse the cave."
			print "Continuing through the now lit cave, you spot a chest covered in soot!"
			print "You dust the soot off the chest and open it..."
			player.inventory["Amulet"] = True
			print "You got the Amulet of Resurrection!"
			print "You equip the amulet and use the pelt to easily hike the remainder of the volcano."
			print "After much walking, you spot the exit!"
			print "You sprint to the outside and see the Palace in the distance!"
			print "You run to the Palace with your cape and armor on!"
			DarkPalace()
		else:
			print "After much walking in the darkness of the cave, you spot the exit!"
			print "You sprint to the outside and see the Palace in the distance!"
			print "Blinded by the light, you run to the palace!"
			DarkPalace()
			
			
class DarkPalace(Scene):
	

	def enter(self):
		pass
		
	def play(self):
		print "You have finally reached the Palace."
		print "You stand at the front gate and admire the grandeur of the building."
		print "Inhaling a large breath of air, you shout at the Palace: \"My body is ready!\""
		print "All of a sudden, the gate opens and a man exits the Palace."
		print "The man wears a purple uniform and is wielding a dark lance."
		print "The guard shouts: \"ALL HAIL THE OVERMIND! GLORY TO THE EVIL WIZARD!\""
		print "With that, the corrupted guard charges you!"
		self.corrupted_guard_fight()
		
	def corrupted_guard_fight(self):	
		Delay()
		corrupt_fight = random.randint(1,10)
		if (corrupt_fight <= 6 and player.weapon_equip == "Armed"):
			print "With the help of your weapon and skill, you defeat the corrupted guard!"
			self.palace_continue()
		elif (corrupt_fight <= 4 and player.weapon_equip == "Unarmed"):
			print "With your cunning skills, you defeat the corrupted guard!"
			self.palace_continue()
		else:
			print "The corrupt guard lets loose a guttural screech and impales you with his dark lance."
			if "Amulet" in player.inventory:
				Resurrection()
				self.corrupted_guard_fight()
			else:
				Death()
				

	def palace_continue(self):
		print "The corrupted guard utters \"I'm sorry, Carissa...\" before slipping away."
		print "You step over the corpse of the poor guard and enter the Palace gate."
		print "Inside the Palace, the walls are lined with dark banners."
		print "You walk up the center stairway toward the top of the Palace."
		print "You reach the throne room and notice a large keyhole with horns on the door."
		print "Sighing, you look down and spot a large yellow horned key."
		print "You scratch your head in confusion then insert the big key into the keyhole."
		print "\"Ha, ha, ha. %s, what took you so long?\"" % player.name
		print "\"Well, let's hurry this up. I've got a triwizard tournament to attend in an hour.\""
		self.evilWizard()
		
	def evilWizard(self):
		while (wizard.hp > 0):
			Delay()
			print "You charge at the Evil Wizard with your %s and attack!" % player.weapon
			charge = random.randint(1,10)
			if "Wither" in player.status:
				charge = charge - 2
			if charge > 3:
				print "The Evil Wizard gets knocked back by your attack in a grunt of pain."
				if player.weapon_equip == "Armed":
					wizard.hp = wizard.hp - 2
				else:
					wizard.hp = wizard.hp - 1
				if wizard.hp == 0:
					Victory()
			else:
				print "The Evil Wizard shunpos away to a ward on the ground, dodging your attack."
			self.attack_pattern()	
			
	def attack_pattern(self):
		cast = random.randint(1,10)
		if cast > 8:
			print "The wizard draws back a magical bow, \"You belong in a museum!\""
			print "A barrage of arcane energy launches from the bow in your direction."
			dodge = random.randint(1,10)
			if "Wither" in player.status:
				dodge = dodge - 2
			if dodge > 6:
				print "You tumble out of the way of the barrage and stand for another attack."
			else:
				print "The mystical shot of energy penetrates and your body disintegrates."
				if "Amulet" in player.inventory:
					Resurrection()
					self.evilWizard()
				else:
					Death()
		elif (cast > 6 and "Wither" not in player.status):
			print "\"The cycle of life and death continues. I will live, you will die.\""
			print "A sandstorm emits from the hand of the Wizard, blinding you and lowering your accuracy."
			player.status["Wither"] = True
		else: 
			print "\"I fight for a darker tomorrow.\""
			print "The Evil Wizard fires an orb of electricity through an acceleration gate."
			shocking = random.randint(1, 100)
			if "Wither" in player.status:
				shocking = shocking + 20
			if shocking <= 75:
				print "You sidestep away from the incoming shot."
				print "The wizard's rage is beyond his control."
				print "You ready another charge."
				
			elif "Magma armor" in player.inventory:
				print "The shocking blast explodes on contact with you."
				print "Your magma armor crumbles as it absorbs the blows"
				del player.inventory["Magma armor"]
			else: 
				print "The shocking blast explodes on contact with you."
				player.hp = player.hp - 1
				if (player.hp == 0 and "Amulet" in player.inventory):
					print "The electricity courses through your body and you fall to the ground."
					Resurrection()
					print "The wizard screams, \"Haxorz!\""
					self.evilWizard()
				if player.hp == 0:
					print "The electricity courses through your body and you fall to the ground."
					Death()	
			print "The wizard screams, \"Haxorz!\""
			print "Clutching your head, you ready another charge."
		
class Death(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "..."
		print "You lose. That's too bad..."
		sys.exit()
		
		
class Victory(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "Staring into the eyes of the downed Evil Wizard, you utter one small phrase."
		if player.weapon == "dagger":
			print "\"If you run, you won't see me stab you.\""
			print "With that, you throw your dagger into the Evil Wizard, ending his reign."
		elif player.weapon == "gun":
			print "\"Enjoy your visit to the depths of the sea, landlubber!\""
			print "With that, you shoot your gun at the Wizard, ending his reign."
		elif player.weapon == "sword":
			print "\"You never stood a chance.\""
			print "With that, you critically strike the Wizard with your sword, ending his reign."
		elif player.weapon == "magical staff":
			print "\"What's heroic and magical and is about to show you the definition of pain?!\""
			print "With that, you blast the Wizard with a blizzard from your staff, ending his reign."
		elif player.weapon == "lance":
			print "\"By my will, this shall be finished.\""
			print "With that, you extend your lance through the Wizard, ending his reign."
		elif player.weapon == "spinning axe":
			print "\"Welcome to the League of %s.\"" % player.name
			print "With that, you throw your spinning axe at the Wizard, ending his reign."
		elif player.weapon == "crossbow and quiver":
			print "\"I have no time for nonsense.\""
			print "With that, you condemn the Wizard into the wall with your crossbow, ending his reign."
		elif player.weapon == "iron gauntlets":
			print "\"Hey, Wizard. POWER SLAM!\""
			print "With that, you dash forward at the Wizard and knock him up with your gauntlets, ending his reign."
		else:
			print "\"Imagine if I had a real weapon.\""
			print "With that, you punch the Wizard through the face, ending his reign."
		
		print "..."
		print "You defeated the Evil Wizard and saved the world!"
		print "Press enter to continue."	
		ending = raw_input("> ")
		print "You exit the Palace, leaving the remains of the Evil Wizard."
		print "After you walk past the gate, the mail man from earlier runs up to you."
		print " 'I thought you were %s! Excellent, I have this letter for you then!' " % player.name
		print "He hands you a letter. You look down at it, then back up at the mail man."
		print "He has already run off in the opposite direction. Well, a mail man's job is never done."
		print "You open the letter..." 
		print ""
		print ""
		print ""
		print ""
		print ""
		print "Special thanks to Kevin London."
		print ""
		print "Thank you so much for playing my game!"
		sys.exit()
		
	
class Delay(Scene):

	def enter(self):
		pass
		
	def play(self):
		print "Press enter to continue!"
		fight = raw_input("> ")
		print "FIGHT!"
		return
		
class Resurrection(Scene):
	
	def enter(self):
		pass
		
	def play(self):
		print "As your body limply falls to the ground, a blinding light emits from your chest."
		print "The light envelopes your body and levitates you back up to your feet."
		print "The light dissipates and the Amulet of Resurrection breaks in your hand."
		del player.inventory["Amulet"]
		print "With renewed energy, you charge at your surprised attacker."
		return
	
class Events(object):
	#Show Options
	pass

class NPCs(object):
	pass



		
def Letter():
	print "You're walking through the meadow, enjoying the time to yourself."
	print "You see a glimmer in the distance. You squint to try and figure out what it is."
	print "Oh, it's the mail man! Looks like he's here to deliver a letter to you."
	print " 'Excuse me! What is your name?' "
	player.name = raw_input("> ")
	print " 'I thought you were %s! Excellent, I have this letter for you then!' " % player.name
	print "He hands you a letter. You look down at it, then back up at the mail man."
	print "He has already run off in the opposite direction. Well, a mail man's job is never done."
	print "You open the letter..."
	print " 'Dear %s, the Evil Wizard has taken over the Palace." % player.name
	print "You have been chosen to defeat the Evil Wizard and save the world.' " 
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


if __name__ == "__main__":
	Letter()