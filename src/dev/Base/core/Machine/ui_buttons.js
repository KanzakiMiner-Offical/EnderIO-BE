
var buttonScale = 55
var isEnabled = false;
var buttonMap = {}

var ToolHUD = {

   buttons: {},
   currentUIscreen: "",
   container: null,
   Window: new UI.Window({
      location: {
         x: 1000 - buttonScale,
         y: UI.getScreenHeight() / 2 - buttonScale * 2,
         width: buttonScale,
         height: buttonScale * 5
      },
      drawing: [{ type: "background", color: 0 }],
      elements: {}
   }),


   registerButton: function(button) {
      this.buttons[button.name] = button;
      buttonMap[button.name] = false;
   },

   getButtons: function(id) {
      return this.buttons[id];
   },

   setButtonFor: function(id, name) {
      this.getButton(name).bindItem(id);
   },

   setArmorButton: function(id, name) {
      this.setButtonFor(id, name);
   },

   onClick: function(name) {
      Network.sendToServer("enderpe.clickHUDButton", { name: name });
   },

   updateUIbuttons: function() {
      var elements = ToolHUD.Window.getContent().elements;
      for (var name in buttonMap) {
         if (buttonMap[name]) {
            var button = this.getButton(name);
            if (!elements[name]) {
               elements[name] = button.uiElement;
            }
            button.onUpdate(button.uiElement);
            buttonMap[name] = false;
         }
         else {
            elements[name] = null;
         }
      }
   },

   onUpdate: function() {
      if (this.currentUIscreen == "in_game_play_screen") {
         var item = Player.getCarriedItem();
         var armor = [];
         for (var i = 0; i < 4; i++) {
            var slot = Player.getArmorSlot(i);
            if (slot.id > 0)
               armor.push(slot);
         }
         for (var name in this.buttons) {
            var button = this.buttons[name];
            if (button.type == "armor") {
               for (var i = 0; i < armor.length; i++) {
                  var slot = armor[i];
                  if (button.isBindedItem(slot.id)) {
                     buttonMap[name] = true;
                     isEnabled = true;
                     break;
                  }
               }
            }
            else if (button.isBindedItem(item.id)) {
               buttonMap[name] = true;
               isEnabled = true;
            }
         }
         if (isEnabled) {
            if (!this.container || !this.container.isOpened()) {
               this.container = new UI.Container();
               this.container.openAs(this.Window);
            }
            this.updateUIbuttons();
         }
         else if (!isEnabled && (this.container === null || this.container !== undefined && this.container.isOpened())) {
            this.container.close();
         }
      }
      else if (this.container) {
         this.container.close();
         this.container = null;
      }
      isEnabled = false;
   }
}
ToolHUD.Window.setAsGameOverlay(true);

Callback.addCallback("NativeGuiChanged", function(screenName) {
   ToolHUD.currentUIscreen = screenName;
   if (screenName != "in_game_play_screen" && ToolHUD.container) {
      ToolHUD.container.close();
   }
});

Callback.addCallback("LocalTick", ToolHUD.onUpdate);
// Server Side
Network.addServerPacket("EnderCore.clickHUDButton", function(client, data) {
   var player = client.getPlayerUid();
   ToolHUD.getButton(data.name).onClick(player);
});
/*
Network.addServerPacket("EnderCore.setFlying", function(client, data) {
   var player = client.getPlayerUid();
   JetpackProvider.setFlying(player, data.fly);
});
*/
/*
this.uiElement = {
				type: "button",
				x: 0,
				y: uiData.position * 1000,
				...uiData,
				clicker: {
					onClick: () => {
						ToolHUD.onClick(this.name);
					}
				}
			}
*/

function AbstractButton(name, type, uiData) {
   this.name = name;
   this.type = type;
   this.uiData = uiData;
   this.bindedItems = [];
   this.uiElement = {
      type: "button",
      x: 0,
      y: this.uiData.position * 1000,
      scale: uiData.scale,
      bitmap: uiData.bitmap,
      bitmap2: uiData.bitmap2 || null,
      clicker: {
         onClick: function() {
            ToolHUD.onClick(this.name);
         }
      }
   }
}
AbstractButton.prototype.bindItem = function(id) {
   this.bindedItems.push(id);
};
AbstractButton.prototype.isBindedItem = function(id) {
   return this.bindedItems.indexOf(id) != -1;
};
AbstractButton.prototype.onClick = function(player) {};
AbstractButton.prototype.onUpdate = function(element) {};
ToolHUD.AbstractButton = AbstractButton;

function ButtonFly() {
   this.isTouched = false;
}

ButtonFly.prototype = new AbstractButton("button_fly", "armor", {
   position: 1,
   bitmap: "button_fly_on",
   bitmap2: "button_fly_off",
   scale: 50
})

ButtonFly.prototype.onUpdate = function() {
   var isFlying = ToolHUD.container.isElementTouched(this.name);
   if (this.isTouched != isFlying) {
      this.isTouched = isFlying;
      Network.sendToServer("EnderCore.setFlying", { fly: isFlying });
   }
   var armor = Player.getArmorSlot(1);
   var hoverMode = (armor.extra !== undefined && armor.extra.getBoolean("hover")) || false;
   var energyStored = ChargeItemRegistry.getEnergyStored(armor);
   var posY = Player.getPosition().y;
   if (energyStored >= 8 && posY < 256) {
      var vy = Player.getVelocity().y;
      if (isFlying) {
         var maxVel = Math.min(32, 265 - posY) / 160; // max 0.2
         if (hoverMode) {
            if (vy < 0.2)
               Player.addVelocity(0, Math.min(maxVel, 0.2 - vy), 0);
         }
         else if (vy < 0.67) {
            Player.addVelocity(0, Math.min(maxVel, 0.67 - vy), 0);
         }
      }
      else if (hoverMode) {
         if (vy < -0.1)
            Player.addVelocity(0, Math.min(0.25, -0.1 - vy), 0);
      }
   }
}

ToolHUD.ButtonFly = ButtonFly;
