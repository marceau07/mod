///* -- Pocket Manager -- *///
///* --- Version: 0.1 --- *///
///* - By: @TaQuItO_988 - *///


///# Random Functions #///
var lastGameMode;
var lastTime;
var lastRainLevel;
var lastLightningLevel;

function selectLevelHook(){
		LoadingScreen.init();
		LoadingScreen.show("Pocket Manager\n\n\nloading data...");
		PocketManagerUI.init();
}
function newLevel(){
		PocketManagerButton.init();
		PocketManagerButton.show();
		TipMessage.init();
}
function leaveGame(){
		PocketManagerButton.hide();
		PocketManagerUI.hide();
		TipMessage.hide();
}
function modTick(){
		if(Level.getGameMode()!==lastGameMode){
				changeGameModeHook(Level.getGameMode());
				lastGameMode = Level.getGameMode();
		}
		if(Math.floor(Level.getLightningLevel())!==lastLightningLevel||Math.floor(Level.getRainLevel())!==lastRainLevel){
				changeWeatherHook(Level.getRainLevel(),Level.getLightningLevel());
				lastRainLevel = Level.getRainLevel();
				lastLightningLevel = Level.getLightningLevel();
		}
		if(Level.getBrightness(0,128,0)<8&&lastTime!=="night"){
				changeTimeHook("night");
				lastTime = "night";
		}
		else if(Level.getBrightness(0,128,0)>7&&lastTime!=="day"){
				changeTimeHook("day");
				lastTime = "day";
		}
}
function changeGameModeHook(newGameMode){
		UiThread(function(){
				if(newGameMode===0)
						PocketManagerUI.gameMode_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",48,0,16,16).getBitmap());
				else if(newGameMode===1)
						PocketManagerUI.gameMode_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",32,0,16,16).getBitmap());
		});
}
function changeTimeHook(newTime){
		UiThread(function(){
				if(newTime==="day")
						PocketManagerUI.time_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",48,16,16,16).getBitmap());
				else if(newTime==="night"){
						PocketManagerUI.time_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",0,32,16,16).getBitmap());
				}
		});
}
function changeWeatherHook(newRainLevel,newLightningLevel){
		UiThread(function(){
				if(newRainLevel===0)
						PocketManagerUI.weather_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",0,16,16,16).getBitmap());
				else if(newRainLevel>0&&newLightningLevel===0)
						PocketManagerUI.weather_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",16,16,16,16).getBitmap());
				else if(newLightningLevel>0)
						PocketManagerUI.weather_button.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",32,16,16,16).getBitmap());
		});
}
function writeFileFromByteArray(byteArray,path){
		fontFile = new java.io.File(path);
		if(fontFile.exists())
				fontFile.delete();
		fontFile.createNewFile();
		fontStream = new java.io.FileOutputStream(fontFile);
		fontStream.write(byteArray);
		fontStream.close();
}


///# Pocket Manager System #///
var PocketManager = {
		settings:{
				THUMB_SIZE:1,
				BUTTON_POSITION:"right-bottom",
				THEME:"MCPE"
		},
		selectedItem:{
				ID:null,
				DATA:0
		},
		init:function(){
				this.loadData();
				LoadingScreen.init();
				LoadingScreen.show("Pocket Manager\n\nloading data...");
				PocketManagerUI.init();
				PocketManagerButton.init();
				PocketManagerButton.show();
		},
		saveData:function(){
				var file = new java.io.File("/sdcard/games/com.mojang/minecraftpe/PocketManager.txt");
				file.getParentFile().mkdirs();
				var fileBR = new java.io.BufferedWriter(new java.io.FileWriter(file));
				fileBR.write(JSON.stringify(this.settings));
				fileBR.close();		
		},
		loadData:function(){
				var file = new java.io.File("/sdcard/games/com.mojang/minecraftpe/PocketManager.txt");		
				if(!file.exists())this.saveData();
				var fileBR = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file)));
				this.settings = JSON.parse(fileBR.readLine());
				fileBR.close();
		},
		goToURL:function(url){
				var uri = android.net.Uri.parse(url);
				var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,uri);
				ctx.startActivity(intent);
		}
};


///# GUI System #///
var PocketManagerUI = {
		init:function(){
				this.widget = new android.widget.RelativeLayout(ctx);
				this.window = new android.widget.PopupWindow(this.widget,ScreenWidth(),ScreenHeight());
				this.window.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(144,0,0,0)));
				
				//Tools
				this.toolsTab = CreateLayoutView(new android.widget.RelativeLayout(ctx),dp(8),dp(8),dp(98),ScreenHeight()-dp(16));
				this.toolsTab.setBackgroundDrawable(BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",34,43,14,14).getBitmap(),dp(3),dp(3),dp(8),dp(8),dp(88),ScreenHeight()-dp(16)));
				this.toolsTab.addView(ModPEGUI.minecraftLabel("§fTools",0,dp(4),dp(102),dp(10),true));			
				this.toolsTab.addView(ModPEGUI.minecraftButton("About",dp(6),ScreenHeight()-dp(86),dp(86),dp(20),function(){
						PocketManagerUI.widget.addView(PocketManagerUI.about_widget);
				}));
				this.toolsTab.addView(ModPEGUI.minecraftButton("Settings",dp(6),ScreenHeight()-dp(64),dp(86),dp(20),function(){
						PocketManagerUI.widget.addView(PocketManagerUI.settings_widget);
				}));
				this.toolsTab.addView(ModPEGUI.minecraftButton("Exit",dp(6),ScreenHeight()-dp(42),dp(86),dp(20),function(){
						PocketManagerUI.hide();
				}));	
				this.widget.addView(this.toolsTab);
				this.toolsTab.addView(ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",16,32,16,16).getBitmap(),dp(6),dp(16),dp(20),dp(20),function(){												
				    for(let i=0;i<36;i++){Player.clearInventorySlot(i);}
						for(let i=0;i<3;i++){Player.setArmorSlot(i,0,0,0);}
						TipMessage.show("§aYour inventory has been cleared");
				}));
				this.toolsTab.addView(ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",0,0,16,16).getBitmap(),dp(28),dp(16),dp(20),dp(20),function(){
						Player.setHealth(Entity.getMaxHealth(Player.getEntity()));
						TipMessage.show("§aYour health has been restored");
				}));		
				this.toolsTab.addView(ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",16,0,16,16).getBitmap(),dp(50),dp(16),dp(20),dp(20),function(){
						Player.setHunger(20);
						TipMessage.show("§aYour hunger has been restored");
				}));
				this.toolsTab.addView(ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",32,32,16,16).getBitmap(),dp(72),dp(16),dp(20),dp(20),function(){
							Level.setSpawn(Player.getX(),Player.getY(),Player.getZ());
							TipMessage.show("§aYour spawn position has been updated");
				}));			
				this.gameMode_button = ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",32,0,16,16).getBitmap(),dp(6),dp(38),dp(20),dp(20),function(){
						if(Level.getGameMode()===0){
								TipMessage.show("§aYour gamemode has been changed");
								Level.setGameMode(1);
						}else{
								TipMessage.show("§aYour gamemode has been changed");
								Level.setGameMode(0);
						}
				});
				this.weather_button = ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",0,16,16,16).getBitmap(),dp(28),dp(38),dp(20),dp(20),function(){
						if(Level.getRainLevel()===0){
								Level.setRainLevel(1);
								TipMessage.show("§aSet weather to Rain");
						}
						else if(Level.getRainLevel()>0&&Level.getLightningLevel()===0){
								Level.setLightningLevel(1);
								TipMessage.show("§aSet weather to Thunder");
						}
						else if(Level.getLightningLevel()>0){
								Level.setRainLevel(0);
								Level.setLightningLevel(0);
								TipMessage.show("§aSet weather to Clear");
						}
				});
				this.time_button = ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",48,16,16,16).getBitmap(),dp(50),dp(38),dp(20),dp(20),function(){
						if(Level.getBrightness(0,128,0)<7){
								Level.setTime(6000);
								TipMessage.show("§aSet time to "+Level.getTime());
						}else{
								Level.setTime(18000);
								TipMessage.show("§aSet time to "+Level.getTime());
						}
				});
				this.toolsTab.addView(this.gameMode_button);
				this.toolsTab.addView(this.weather_button);
				this.toolsTab.addView(this.time_button);
				this.toolsTab.addView(ModPEGUI.minecraftImageButton(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",48,32,16,16).getBitmap(),dp(72),dp(38),dp(20),dp(20),function(){
						PocketManagerUI.widget.addView(PocketManagerUI.extras_widget);
				}));			
				
				//Items Picker
				this.horizontalSlots = Math.floor((ScreenWidth()-dp(118))/dp(26));
				this.itemsTab = CreateLayoutView(new android.widget.RelativeLayout(ctx),dp(110),dp(8),ScreenWidth()-dp(118),ScreenHeight()-dp(16));
				this.itemsTab.setBackgroundDrawable(BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",34,43,14,14).getBitmap(),dp(3),dp(3),dp(8),dp(8),ScreenWidth()-dp(118),ScreenHeight()-dp(16)));
				this.itemsTab.addView(ModPEGUI.minecraftLabel("§fItems Picker",0,dp(4),ScreenWidth()-dp(118),dp(10),true));
				this.widget.addView(this.itemsTab);
				this.itemsDisplay = CreateLayoutView(new android.widget.ScrollView(ctx),dp(6),dp(16),ScreenWidth()-dp(130),ScreenHeight()-dp(38));			
				this.itemsDisplay.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.rgb(49,49,49)));
				this.itemsDisplay.setPadding(((ScreenWidth()-dp(130))-this.horizontalSlots*dp(26))/2,dp(6),((ScreenWidth()-dp(130))-this.horizontalSlots*dp(26))/2,dp(6));			
				this.itemsDisplay.setOverScrollMode(android.view.View.OVER_SCROLL_NEVER);					
				this.itemsDisplay.setVerticalScrollBarEnabled(false);
				this.slots_frame = new android.widget.RelativeLayout(ctx);
				this.itemsDisplay.addView(this.slots_frame);
				var b = 0;
				for(let i=1;i<=4096;i++){
						if(Item.isValidItem(i)===true){						
								if(Items[i]!==undefined){							
										var slot = CreateLayoutView(new android.widget.ImageView(ctx),dp(26*(b%this.horizontalSlots)),dp(26*Math.floor(b/this.horizontalSlots)),dp(26),dp(26));
										slot.setScaleType(android.widget.ImageView.ScaleType.CENTER);
										slot.setImageBitmap(Items[i][0].image);
								}else{
										var slot = CreateLayoutView(new android.widget.TextView(ctx),dp(26*(b%this.horizontalSlots)),dp(26*Math.floor(b/this.horizontalSlots)),dp(26),dp(26));
										slot.setGravity(android.view.Gravity.CENTER);
										MinecraftText(slot,i.toString(),true,dp(6));
								}							
								slot.setBackgroundDrawable(BitmapUtils.ultimateDrawable("gui/gui.png",200*guiImageSize(),46*guiImageSize(),16*guiImageSize(),16*guiImageSize(),dp(26),dp(26)))
								slot.setClickable(true);
								slot.setTag(i.toString());						
								AddClickFunction(slot,function(view){
										MinecraftText(PocketManagerUI.selector_name,"§f"+Item.getName(view.getTag().toString(),0),true);
										MinecraftText(PocketManagerUI.selector_data,view.getTag()+":0",true);
										PocketManagerUI.selector_slider.setProgress(64);									
										if(Items[view.getTag().toString()]!==undefined)
												PocketManagerUI.selector_image.setImageBitmap(Items[view.getTag().toString()][0].image);
										else 
												PocketManagerUI.selector_image.setImageBitmap(BitmapUtils.ultimateDrawable("gui/pocket_manager_icons.png",0,48,16,16,dp(32),dp(32)).getBitmap());											
										PocketManagerUI.widget.addView(PocketManagerUI.selector_widget);
										PocketManager.selectedItem.ID = parseInt(view.getTag().toString());
										PocketManager.selectedItem.DATA = 0;
								});
								this.slots_frame.addView(slot);
								b++;
						}
				}				
				this.itemsTab.addView(this.itemsDisplay);
				
				//About Screen
				this.about_widget = CreateLayoutView(new android.widget.RelativeLayout(ctx),0,0,ScreenWidth(),ScreenHeight());
				this.about_widget.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(144,0,0,0)));
				this.about_widget.setClickable(true);		
				this.about_screen = CreateLayoutView(new android.widget.RelativeLayout(ctx),ScreenWidth()/2-dp(85),ScreenHeight()/2-dp(60),dp(170),dp(120));
				this.about_screen.setBackgroundDrawable( BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),dp(192),dp(120)));		
				this.about_screen.addView(ModPEGUI.minecraftLabel("§fAbout the mod...",0,dp(4),dp(162),dp(10),true));
				this.about_screen.addView(ModPEGUI.minecraftLabel("Mod Name: §ePocket Manager\n§rMod Version: §eBETA 1.0\n§rMod Creator: §eTaQuItO_988\n§r",dp(12),dp(22),dp(138),dp(40),true,dp(8),android.view.Gravity.LEFT,dp(4)));		
				this.about_screen.addView(ModPEGUI.minecraftButton("Back",dp(4),dp(96),dp(162),dp(20),function(){PocketManagerUI.widget.removeView(PocketManagerUI.about_widget);}));
				this.about_screen.addView(ModPEGUI.minecraftButton("Twitter",dp(4),dp(74),dp(80),dp(20),function(){
						PocketManager.goToURL("http://twitter.com/TaQuItO_988");
				}));
				this.about_screen.addView(ModPEGUI.minecraftButton("YouTube",dp(86),dp(74),dp(80),dp(20),function(){
						PocketManager.goToURL("http://www.youtube.com/c/TaQuItO9883");
				}));			
				this.about_widget.addView(this.about_screen);		
				
				//Settings Screen
				this.settings_widget = CreateLayoutView(new android.widget.RelativeLayout(ctx),0,0,ScreenWidth(),ScreenHeight());
				this.settings_widget.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(144,0,0,0)));
				this.settings_widget.setClickable(true);		
				this.settings_screen = CreateLayoutView(new android.widget.RelativeLayout(ctx),ScreenWidth()/2-dp(85),ScreenHeight()/2-dp(60),dp(170),dp(120));
				this.settings_screen.setBackgroundDrawable( BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),dp(192),dp(120)));
				this.settings_screen.addView(ModPEGUI.minecraftLabel("§fSettings",0,dp(4),dp(162),dp(10),true));		
				this.settings_screen.addView(ModPEGUI.minecraftLabel("Button position",0,dp(20),dp(162),dp(10),true));			
				this.button_position = ModPEGUI.minecraftButton("§e"+PocketManager.settings.BUTTON_POSITION,dp(4),dp(32),dp(162),dp(20),function(){
						switch(PocketManager.settings.BUTTON_POSITION){
								case "left-top":PocketManager.settings.BUTTON_POSITION = "left-bottom";break;
								case "left-bottom":PocketManager.settings.BUTTON_POSITION = "right-top";break;
								case "right-top":PocketManager.settings.BUTTON_POSITION = "right-bottom";break;
								case "right-bottom":PocketManager.settings.BUTTON_POSITION = "left-top";break;
						}
						MinecraftText(PocketManagerUI.button_position,"§e"+PocketManager.settings.BUTTON_POSITION,true);
				});
				this.settings_screen.addView(this.button_position);
				this.settings_screen.addView(ModPEGUI.minecraftLabel("Slider Thumb Size",0,dp(60),dp(162),dp(10),true));
				this.settings_slider = ModPEGUI.minecraftSlider(dp(4),dp(72),dp(162),10,10);			
				this.settings_slider.setProgress(5);
				this.settings_slider.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener(){
						onProgressChanged:function(view){
								PocketManager.settings.THUMB_SIZE = 1+(view.getProgress()-5)*0.1;
								PocketManagerUI.settings_slider.setThumb(BitmapUtils.ultimateDrawable("gui/touchgui.png",225,125,11,17,dp(33*PocketManager.settings.THUMB_SIZE),dp(51*PocketManager.settings.THUMB_SIZE)));
								PocketManagerUI.selector_slider.setThumb(BitmapUtils.ultimateDrawable("gui/touchgui.png",225,125,11,17,dp(33*PocketManager.settings.THUMB_SIZE),dp(51*PocketManager.settings.THUMB_SIZE)))
						}
				});
				this.settings_screen.addView(this.settings_slider);
				this.settings_screen.addView(ModPEGUI.minecraftButton("Back",dp(4),dp(96),dp(162),dp(20),function(){
						PocketManagerUI.widget.removeView(PocketManagerUI.settings_widget);
						PocketManager.saveData();
				}));
				this.settings_widget.addView(this.settings_screen);			
				
				//Extras Screen
				this.extras_widget = CreateLayoutView(new android.widget.RelativeLayout(ctx),0,0,ScreenWidth(),ScreenHeight());
				this.extras_widget.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(144,0,0,0)));
				this.extras_widget.setClickable(true);		
				this.extras_screen = CreateLayoutView(new android.widget.RelativeLayout(ctx),ScreenWidth()/2-dp(85),ScreenHeight()/2-dp(60),dp(170),dp(120));
				this.extras_screen.setBackgroundDrawable( BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),dp(192),dp(120)));
				this.extras_screen.addView(ModPEGUI.minecraftLabel("§fExtras",0,dp(4),dp(162),dp(10),true));
				this.extras_screen.addView(ModPEGUI.minecraftLabel("Work In Progress...",0,dp(40),dp(162),dp(10),true));
				this.extras_screen.addView(ModPEGUI.minecraftButton("Back",dp(4),dp(96),dp(162),dp(20),function(){PocketManagerUI.widget.removeView(PocketManagerUI.extras_widget);}));
				this.extras_widget.addView(this.extras_screen);
				
				//Item Selector Screen
				this.selector_widget = CreateLayoutView(new android.widget.RelativeLayout(ctx),0,0,ScreenWidth(),ScreenHeight());
				this.selector_widget.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.argb(144,0,0,0)));
				this.selector_widget.setClickable(true);		
				this.selector_screen = CreateLayoutView(new android.widget.RelativeLayout(ctx),ScreenWidth()/2-dp(69),ScreenHeight()/2-dp(60),dp(138),dp(120));
				this.selector_screen.setBackgroundDrawable( BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),dp(138),dp(120)));		
				this.selector_name = ModPEGUI.minecraftLabel("§fnull",dp(4),dp(6),dp(130),dp(9),true,dp(8),android.view.Gravity.CENTER|android.view.Gravity.TOP);
				this.selector_name.setSingleLine(true);
				this.selector_data = ModPEGUI.minecraftLabel("0:0",dp(4),dp(16),dp(130),dp(9),true,dp(8),android.view.Gravity.CENTER|android.view.Gravity.TOP);			
				this.selector_data.setSingleLine(true);
				this.selector_image = CreateLayoutView(new android.widget.ImageView(ctx),dp(53),dp(32),dp(32),dp(32));
				this.selector_amount = ModPEGUI.minecraftLabel("§f",dp(69),dp(54),dp(16),dp(11),true,dp(10),android.view.Gravity.RIGHT|android.view.Gravity.TOP);
				this.selector_amount.setSingleLine(true);
				this.selector_slider = ModPEGUI.minecraftSlider(dp(16),dp(70),dp(106),4,64);
				this.selector_slider.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener(){
						onProgressChanged:function(view){
								if(view.getProgress()>1)MinecraftText(PocketManagerUI.selector_amount,"§f"+view.getProgress(),true,dp(10));
								else MinecraftText(PocketManagerUI.selector_amount,"");							
						}
				});
				this.selector_screen.addView(ModPEGUI.minecraftButton("<",dp(16),dp(33),dp(15),dp(30),function(){
						if(Items[PocketManager.selectedItem.ID][PocketManager.selectedItem.DATA-1]!==undefined){
								MinecraftText(PocketManagerUI.selector_name,"§f"+Item.getName(PocketManager.selectedItem.ID,PocketManager.selectedItem.DATA-1),true);
								MinecraftText(PocketManagerUI.selector_data,PocketManager.selectedItem.ID+":"+(PocketManager.selectedItem.DATA-1),true);							
								PocketManagerUI.selector_image.setImageBitmap(Items[PocketManager.selectedItem.ID][PocketManager.selectedItem.DATA-1].image);							
								PocketManager.selectedItem.DATA--;
						}
				}));
				this.selector_screen.addView(ModPEGUI.minecraftButton(">",dp(107),dp(33),dp(15),dp(30),function(){
						if(Items[PocketManager.selectedItem.ID][PocketManager.selectedItem.DATA+1]!==undefined){
								MinecraftText(PocketManagerUI.selector_name,"§f"+Item.getName(PocketManager.selectedItem.ID,PocketManager.selectedItem.DATA+1),true);
								MinecraftText(PocketManagerUI.selector_data,PocketManager.selectedItem.ID+":"+(PocketManager.selectedItem.DATA+1),true);							
								PocketManagerUI.selector_image.setImageBitmap(Items[PocketManager.selectedItem.ID][PocketManager.selectedItem.DATA+1].image);							
								PocketManager.selectedItem.DATA++;
						}
				}));				
				this.selector_screen.addView(this.selector_name);
				this.selector_screen.addView(this.selector_data);
				this.selector_screen.addView(this.selector_image);
				this.selector_screen.addView(this.selector_amount);
				this.selector_screen.addView(this.selector_slider);			
				this.selector_screen.addView(ModPEGUI.minecraftButton("Back",dp(4),dp(96),dp(64),dp(20),function(){
						PocketManagerUI.widget.removeView(PocketManagerUI.selector_widget);
				}));
				this.selector_screen.addView(ModPEGUI.minecraftButton("Add",dp(70),dp(96),dp(64),dp(20),function(){
						Player.addItemInventory(PocketManager.selectedItem.ID,Math.max(1,PocketManagerUI.selector_slider.getProgress()),PocketManager.selectedItem.DATA);
						TipMessage.show("§aGiven ["+Item.getName(PocketManager.selectedItem.ID,PocketManager.selectedItem.DATA)+"] × "+Math.max(1,PocketManagerUI.selector_slider.getProgress()));
						PocketManagerUI.widget.removeView(PocketManagerUI.selector_widget);
				}));
				this.selector_widget.addView(this.selector_screen);			
		},
		show:function(){
				UiThread(function(){
						if(PocketManagerUI.showed===false){					
								PocketManagerUI.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.CENTER,0,0);
								PocketManagerUI.itemsDisplay.scrollTo(0,0);
								PocketManagerUI.showed = true;					
						}
				});
		},
		hide:function(){
				UiThread(function(){
						if(PocketManagerUI.showed===true){
								PocketManagerUI.window.dismiss();			
								PocketManagerUI.showed = false;
								PocketManagerButton.show();
						}
				});
		},showed:false
};
var PocketManagerButton = {
		init:function(){
				this.widget = ModPEGUI.minecraftButton("PM",0,0,dp(20),dp(20),function(){PocketManagerUI.show();PocketManagerButton.hide();});
				this.window = new android.widget.PopupWindow(this.widget,dp(20),dp(20));
		},
		show:function(){
				UiThread(function(){
						if(PocketManagerButton.showed===false){
								switch(PocketManager.settings.BUTTON_POSITION){
										case "left-top":PocketManagerButton.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.LEFT|android.view.Gravity.TOP,0,dp(12));break;
										case "left-bottom":PocketManagerButton.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.LEFT|android.view.Gravity.BOTTOM,0,0);break;
										case "right-top":PocketManagerButton.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.RIGHT|android.view.Gravity.TOP,0,dp(12));break;
										case "right-bottom":PocketManagerButton.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.RIGHT|android.view.Gravity.BOTTOM,0,0);break;
								}
								PocketManagerButton.showed = true;
						}
				});
		},
		hide:function(){
				UiThread(function(){
						if(PocketManagerButton.showed===true){
								PocketManagerButton.window.dismiss();
								PocketManagerButton.showed = false;
						}
				});
		},showed:false
};
var LoadingScreen = {
		init:function(){
				this.widget = new android.widget.RelativeLayout(ctx);			
				this.window = new android.widget.PopupWindow(this.widget,ScreenWidth(),ScreenHeight());
				this.window.setBackgroundDrawable(Background.dirtWall());			
				this.message = ModPEGUI.minecraftLabel("§fundefined",0,ScreenHeight()/2-dp(21),ScreenWidth(),android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,true,dp(8),android.view.Gravity.CENTER);
				this.message.setPadding(0,dp(1),0,0);
				this.progress = CreateLayoutView(new android.widget.ImageView(ctx),ScreenWidth()/2-dp(50),ScreenHeight()/2+dp(16),dp(100),dp(4.5));
				this.progress.setBackgroundDrawable(Background.progressRect(dp(100),0));		
				this.widget.addView(this.message);
				this.widget.addView(this.progress);			
		},
		show:function(message){
				UiThread(function(){
						MinecraftText(LoadingScreen.message,"§f"+message||"undefined",true);
						LoadingScreen.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.CENTER,0,0);
						new java.lang.Thread(new java.lang.Runnable({
								run:function(){
										for(let i=0;i<=100;i++){
												UiThread(function(){
														LoadingScreen.progress.setBackgroundDrawable(Background.progressRect(dp(100),dp(i)));
														switch(i){
																case 15:MinecraftText(LoadingScreen.message,"Pocket Manager\n\n\nloading items...",true);break;
																case 30:MinecraftText(LoadingScreen.message,"§fPocket Manager\n\n\nloading layout...",true);break;
																case 90:MinecraftText(LoadingScreen.message,"§fPocket Manager\n\n\ninitializing mod...",true);break;
																case 100:LoadingScreen.hide();break;
														}
												});
												java.lang.Thread.sleep(160);
										}
								}
						})).start();					
				});
		},
		hide:function(){
				UiThread(function(){
						LoadingScreen.window.dismiss();
				});
		}
};
var TipMessage = {
		init:function(){
				UiThread(function(){
						TipMessage.handler = new android.os.Handler();
						TipMessage.showRunnable = new java.lang.Runnable(){run:function(){
								TipMessage.hide();
						}};
						TipMessage.hideRunnable = new java.lang.Runnable(){run:function(){
								TipMessage.window.dismiss();
								TipMessage.showed = false;
						}};
				});
				this.showAnimation = new android.view.animation.AlphaAnimation(0,1);
				this.showAnimation.setDuration(180);			
				this.hideAnimation = new android.view.animation.AlphaAnimation(1,0);
				this.hideAnimation.setDuration(180);	
				this.layout = new android.widget.RelativeLayout(ctx);	
				this.widget = new android.widget.TextView(ctx);			
				this.widget.setGravity(android.view.Gravity.CENTER|android.view.Gravity.TOP);
				this.layout.addView(this.widget,new android.widget.RelativeLayout.LayoutParams(ScreenWidth(),ScreenHeight()/4-dp(4)));			
				this.window = new android.widget.PopupWindow(this.layout,ScreenWidth(),ScreenHeight()/4-dp(4));		
				this.window.setTouchable(false);
		},
		show:function(text){
				UiThread(function(){
						MinecraftText(TipMessage.widget,"§f"+text,true);
						TipMessage.window.showAtLocation(ctx.getWindow().getDecorView(),android.view.Gravity.CENTER,0,ScreenHeight()*0.75+dp(4));
						if(TipMessage.showed===false){
								TipMessage.widget.startAnimation(TipMessage.showAnimation);				
								TipMessage.handler.postDelayed(TipMessage.showRunnable,1080);
								TipMessage.showed = true;
						}else{
								TipMessage.handler.removeCallbacks(TipMessage.showRunnable);
								TipMessage.handler.removeCallbacks(TipMessage.hideRunnable);
								TipMessage.handler.postDelayed(TipMessage.showRunnable,1080);
						}					
				});
		},
		hide:function(){
				UiThread(function(){
						TipMessage.widget.startAnimation(TipMessage.hideAnimation);
						TipMessage.handler.postDelayed(TipMessage.hideRunnable,180);
				});
		},showed:false
};


///# GUI Utils #///
writeFileFromByteArray(android.util.Base64.decode("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AICAgID/AP8AAgCAgICAgICAAAAAAQAAAgAAgAOAAAMAABkBMxGAAgABgP6AAAAAAAUAAAAAAgADgAADAAcACwAPABMAACE1IRUlNTMVJREzGQE1MxU9ASEVAQABAP6AgP8AgIABAICAgICAgAGA/oABgICAgICAAAUAAAAAAgADgAADAAcACwAPABMAADE1IRU9ATMVNREzEQE1MxUlNSEVAQCAgP8AgP6AAQCAgICAgIABgP6AAYCAgICAgAAAAAUAAAEAAgACgAADAAcACwAPABMAABE1MxUhNTMVJTUhFSU1MxUhNTMVgAEAgP6AAQD+gIABAIABAICAgICAgICAgICAgAAAAAEAAACAAoADAAALAAAlESE1IREzESEVIREBAP8AAQCAAQD/AIABAIABAP8AgP8AAAEAAP+AAIABAAADAAAVETMRgIABgP6AAAEAAAGAAoACAAADAAARNSEVAoABgICAAAEAAAAAAIABAAADAAAxETMRgAEA/wAAAAUAAAAAAoADgAADAAcACwAPABMAADE1MxU1ETMZATUzFTURMxkBNTMVgICAgICAgIABAP8AAQCAgIABAP8AAQCAgAAABQAAAAACgAOAAAMABwAPABcAGwAAMzUhFQE1MxUBETMRMxUjFSERIzUzNTMRATUhFYABgP8AgP6AgICAAYCAgID+AAGAgIABgICA/wACgP6AgIABgICA/YACgICAAAAAAQAAAAACgAOAAAsAADE1IREjNTM1MxEhFQEAgICAAQCAAgCAgP0AgAAAAAAGAAAAAAKAA4AABwALAA8AEwAXABsAADERMxUhNTMRATUzFT0BIRUBNTMVBREzEQE1IRWAAYCA/gCAAQD+AIABgID+AAGAAQCAgP8AAQCAgICAgAEAgICAAQD/AAEAgIAAAAAABwAAAAACgAOAAAMABwALAA8AEwAXABsAADM1IRUlNTMVIREzEQE1IRUBNTMVBREzEQE1IRWAAYD+AIABgID+gAEA/gCAAYCA/gABgICAgICAAQD/AAEAgIABAICAgAEA/wABAICAAAADAAAAAAKAA4AAAwAHABMAABM1MxU9ATMVExEhETMVIREjNSERgICAgP4AgAGAgAEAAgCAgICAgP2AAQABAIABgID8gAAAAAAEAAAAAAKAA4AAAwAHAAsAEwAAMzUhFSU1MxUhETMRAREhFSEVIRWAAYD+AIABgID9gAKA/gABgICAgICAAYD+gAGAAYCAgIAAAAAABQAAAAACgAOAAAMABwAPABMAFwAAMzUhFTURMxEhETMVIRUhGQE1MxU9ASEVgAGAgP2AgAGA/oCAAQCAgIABAP8AAgCAgP8AAgCAgICAgAADAAAAAAKAA4AAAwAHAA8AACERMxkBNTMVNREhFSMRIREBAICA/oCAAoABgP6AAYCAgIABAIABAP6AAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAMzUhFSURMxEhETMRATUhFSURMxEhETMRATUhFYABgP4AgAGAgP4AAYD+AIABgID+AAGAgICAAQD/AAEA/wABAICAgAEA/wABAP8AAQCAgAAAAAAFAAAAAAKAA4AAAwAHAAsAEwAXAAAzNSEVPQEzFQERMxEBNSE1IREzEQE1IRWAAQCA/gCAAYD+gAGAgP4AAYCAgICAgAGAAQD/AP8AgIABAP4AAgCAgAAAAgAAAAAAgAKAAAMABwAAMREzEQMRMxGAgIABAP8AAYABAP8AAAAAAAIAAP+AAIACgAADAAcAABURMxEDETMRgICAgAGA/oACAAEA/wAAAAAHAAAAAAIAA4AAAwAHAAsADwATABcAGwAAITUzFSU1MxUlNTMVJTUzFT0BMxU9ATMVPQEzFQGAgP8AgP8AgP8AgICAgICAgICAgICAgICAgICAgICAgICAAAAAAAIAAACAAoACAAADAAcAAD0BIRUBNSEVAoD9gAKAgICAAQCAgAAAAAAHAAAAAAIAA4AAAwAHAAsADwATABcAGwAAMTUzFT0BMxU9ATMVPQEzFSU1MxUlNTMVJTUzFYCAgID/AID/AID/AICAgICAgICAgICAgICAgICAgICAgAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAhNTMVAzUzFT0BMxUBNTMVBREzEQE1IRUBAICAgID+AIABgID+AAGAgIABAICAgICAAQCAgIABAP8AAQCAgAAAAAQAAAAAAwADgAADAAcADwATAAAzNSEVJREzETcRIREzETMRATUhFYACAP2AgIABAICA/YACAICAgAKA/YCAAYD/AAGA/gACAICAAAACAAAAAAKAA4AACwAPAAAxETMVITUzESMRIRkBNSEVgAGAgID+gAGAAwCAgP0AAgD+AAMAgIAAAAMAAAAAAoADgAADAAcAEwAAJREzEQM1MxUBESEVIRUhFSERIRUCAICAgP2AAgD+gAGA/oABgIABgP6AAgCAgP2AA4CAgID+gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVPQEzFSERMxEBNTMVJTUhFYABgID9gIABgID+AAGAgICAgIACgP2AAgCAgICAgAACAAAAAAKAA4AAAwALAAAlETMRBREhFSERIRUCAID9gAIA/oABgIACgP2AgAOAgP2AgAAAAQAAAAACgAOAAAsAADERIRUhFSEVIREhFQKA/gABAP8AAgADgICAgP6AgAABAAAAAAKAA4AACQAAMREhFSEVIRUhEQKA/gABAP8AA4CAgID+AAAABAAAAAACgAOAAAMACQANABEAADM1IRU1ESM1IREhETMZATUhFYABgIABAP2AgAIAgICAAYCA/gACgP2AAoCAgAAAAAABAAAAAAKAA4AACwAAMREzESERMxEjESERgAGAgID+gAOA/wABAPyAAgD+AAAAAAABAAAAAAGAA4AACwAAMTUzESM1IRUjETMVgIABgICAgAKAgID9gIAAAwAAAAACgAOAAAMABwALAAAzNSEVJTUzFSERMxGAAYD+AIABgICAgICAgAMA/QAABQAAAAACgAOAAAMABwALABMAFwAAIREzEQE1MxUDNTMVAREzESEVIREBNTMVAgCA/wCAgID+AIABAP8AAYCAAYD+gAGAgIABAICA/YADgP8AgP4AAwCAgAAAAAABAAAAAAKAA4AABQAAMREzESEVgAIAA4D9AIAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MzUzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YACgICA/IAAAAAAAwAAAAACgAOAAAMACwATAAABNTMVAREzFTMVIxEhESM1MxEzEQEAgP6AgICAAYCAgIACAICA/gADgICA/YABgIABgPyAAAAABAAAAAACgAOAAAMABwALAA8AADM1IRUlETMRIREzEQE1IRWAAYD+AIABgID+AAGAgICAAoD9gAKA/YACgICAAAIAAAAAAoADgAADAA0AAAE1MxUBESEVIRUhFSERAgCA/YACAP6AAYD+gAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVMzUzFSU1MxUhETMRJREzEQE1IRWAAQCAgP8AgP4AgAGAgP4AAYCAgICAgICAAoD9gIACAP4AAgCAgAAAAAMAAAAAAoADgAADAAcAEQAAIREzEQM1MxUBESEVIRUhFSERAgCAgID9gAIA/oABgP6AAgD+AAKAgID9gAOAgICA/gAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJTUzFSERMxEBNSEVJTUzFT0BIRWAAYD+AIABgID+AAGA/gCAAgCAgICAgAGA/oABgICAgICAgICAAAAAAAEAAAAAAoADgAAHAAAhESE1IRUhEQEA/wACgP8AAwCAgP0AAAMAAAAAAoADgAADAAcACwAAMzUhFSURMxEhETMRgAGA/gCAAYCAgICAAwD9AAMA/QAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzETMRMxEBETMRIREzEQEAgP8AgICA/gCAAYCAgICAAQD/AAEA/wABAAIA/gACAP4AAAAAAAMAAAAAAoADgAADAAsAEwAAATUzFQERMxEzFSMVITUjNTMRMxEBAID+gICAgAGAgICAAQCAgP8AA4D9gICAgIACgPyAAAAAAAkAAAAAAoADgAADAAcACwAPABMAFwAbAB8AIwAAMREzESERMxEBNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgIABgP6AAYD+gAGAgICAgICAgICAgICAgICAgIAABQAAAAACgAOAAAMABwALAA8AEwAAIREzEQE1MxUzNTMVJTUzFSE1MxUBAID/AICAgP4AgAGAgAKA/YACgICAgICAgICAgAAABQAAAAACgAOAAAUACQANABEAFwAAMREzFSEVATUzFT0BMxU9ATMVPQEhNSERgAIA/gCAgID+AAKAAQCAgAEAgICAgICAgICAgID/AAAAAAABAAAAAAGAA4AABwAAMREhFSERIRUBgP8AAQADgID9gIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAhNTMVJREzEQE1MxUlETMRATUzFQIAgP8AgP8AgP8AgP8AgICAgAEA/wABAICAgAEA/wABAICAAAAAAAEAAAAAAYADgAAHAAAxNSERITUhEQEA/wABgIACgID8gAAAAAUAAAIAAoADgAADAAcACwAPABMAABE1MxUhNTMVJTUzFTM1MxUlNTMVgAGAgP4AgICA/wCAAgCAgICAgICAgICAgIAAAQAA/4ACgAAAAAMAABU1IRUCgICAgAAAAQAAAwABAAOAAAMAABE1IRUBAAMAgIAAAwAAAAACgAKAAAMADQARAAA9ATMdATUhNSE1ITUzEQE1IRWAAYD+gAGAgP4AAYCAgICAgICAgP4AAgCAgAAAAAMAAAAAAoADgAADAAcAEQAAJREzEQE1IRUBETMRMxUjESEVAgCA/oABAP4AgICAAYCAAYD+gAGAgID+AAOA/oCA/wCAAAAAAAUAAAAAAoACgAADAAcACwAPABMAADM1IRU9ATMVIREzEQE1MxUlNSEVgAGAgP2AgAGAgP4AAYCAgICAgAGA/oABAICAgICAAAMAAAAAAoADgAADAAcAEQAANREzGQE1IRUBNSERIzUzETMRgAEA/wABgICAgIABgP6AAYCAgP4AgAEAgAGA/IAAAAAAAwAAAAACgAKAAAMADQARAAAzNSEVJREzFSE1MxEhFRE1IRWAAgD9gIABgID+AAGAgICAAYCAgP8AgAGAgIAAAAIAAAAAAgADgAALAA8AADMRIzUzNTMVIRUhGQE1IRWAgICAAQD/AAEAAgCAgICA/gADAICAAAAAAwAA/4ACgAKAAAMABwARAAAVNSEVAREzEQE1ITUhESE1IRECAP4AgAGA/oABgP6AAgCAgIABgAEA/wD/AICAAQCA/YAAAAAAAwAAAAACgAOAAAMABwAPAAAhETMRATUhFQERMxEzFSMRAgCA/oABAP4AgICAAgD+AAIAgID+AAOA/oCA/oAAAAIAAAAAAIADgAADAAcAADERMxEDNTMVgICAAoD9gAMAgIAAAAQAAP+AAoADAAADAAcACwAPAAAXNSEVJREzESERMxEDNTMVgAGA/gCAAYCAgICAgICAAQD/AAIA/gACgICAAAAFAAAAAAIAA4AAAwAHAAsADwAXAAAhNTMVJTUzFQM1MxU9ATMVAREzETMVIxEBgID/AICAgID+AICAgICAgICAAQCAgICAgP4AA4D+AID/AAAAAAACAAAAAAEAA4AAAwAHAAAzNTMVJREzEYCA/wCAgICAAwD9AAAEAAAAAAKAAoAAAwAHAA0AEQAAAREzERMRMxEhESEVIxEBNTMVAQCAgID9gAEAgAEAgAEAAQD/AP8AAgD+AAKAgP4AAgCAgAACAAAAAAKAAoAAAwAJAAAhETMRIREhFSERAgCA/YACAP6AAgD+AAKAgP4AAAQAAAAAAoACgAADAAcACwAPAAAzNSEVJREzESERMxEBNSEVgAGA/gCAAYCA/gABgICAgAGA/oABgP6AAYCAgAADAAD/gAKAAoAAAwAPABMAAAERMxEBETMVMxUjFSEVIRETNSEVAgCA/YCAgIABgP6AgAEAAQABAP8A/oADAICAgID/AAKAgIAAAAAAAwAA/4ACgAKAAAMABwATAAAZATMZATUhFRMRITUhNSM1MzUzEYABAID+gAGAgICAAQABAP8AAQCAgP2AAQCAgICA/QAAAAAAAwAAAAACgAKAAAMACwAPAAABNTMVAREzFTMVIxETNSEVAgCA/YCAgICAAQABgICA/oACgICA/oACAICAAAAAAAUAAAAAAoACgAADAAcACwAPABMAADE1IRU9ATMVJTUhFSU1MxU9ASEVAgCA/gABgP4AgAIAgICAgICAgICAgICAgIAAAgAAAAABgAOAAAMADwAAITUzFSURIzUzETMRMxUjEQEAgP8AgICAgICAgIABgIABAP8AgP6AAAACAAAAAAKAAoAAAwAJAAA1ETMRFTUhETMRgAGAgIACAP4AgIACAP2AAAAAAAUAAAAAAoACgAADAAcACwAPABMAACE1MxUlNTMVMzUzFSURMxEhETMRAQCA/wCAgID+AIABgICAgICAgICAgAGA/oABgP6AAAIAAAAAAoACgAADAA0AADURMxEVNTMRMxEzETMRgICAgICAAgD+AICAAQD/AAIA/YAAAAAJAAAAAAKAAoAAAwAHAAsADwATABcAGwAfACMAADE1MxUhNTMVJTUzFTM1MxUlNTMVJTUzFTM1MxUlNTMVITUzFYABgID+AICAgP8AgP8AgICA/gCAAYCAgICAgICAgICAgICAgICAgICAgICAgAAAAwAA/4ACgAKAAAMABwAPAAAXNSEVAREzEQE1ITUhETMRgAGA/gCAAYD+gAGAgICAgAGAAYD+gP8AgIABgP2AAAMAAAAAAoACgAAHAAsAEwAAMTUzNTMVIRUBNTMVPQEhNSEVIxWAgAGA/oCA/oACgICAgICAAQCAgICAgICAAAAFAAAAAAIAA4AAAwAHAAsADwATAAAhNSEVJREzEQE1MxU1ETMZATUhFQEAAQD+gID/AICAAQCAgIABAP8AAQCAgIABAP8AAQCAgAAAAQAAAAAAgAOAAAMAADERMxGAA4D8gAAABQAAAAACAAOAAAMABwALAA8AEwAAMTUhFTURMxkBNTMVJREzEQE1IRUBAICA/wCA/oABAICAgAEA/wABAICAgAEA/wABAICAAAAAAAQAAAKAAwADgAADAAcACwAPAAARNTMVITUhFSU1IRUhNTMVgAEAAQD+AAEAAQCAAoCAgICAgICAgIAAAAIAAAAAAIADgAADAAcAADERMxEDNTMVgICAAoD9gAMAgIAAAAMAAAAAAgADAAADAAcACwAAMzUhFSURMxkBNSEVgAGA/gCAAYCAgIACAP4AAgCAgAAAAAACAAAAAAIAAwAADwATAAAxNTMRIzUzNTMVMxUjESEVATUzFYCAgICAgAEA/wCAgAEAgICAgP8AgAKAgIAAAAAABQAAAQABgAKAAAMABwALAA8AEwAAETUzFTM1MxUlNTMVJTUzFTM1MxWAgID/AID/AICAgAEAgICAgICAgICAgICAAAAFAAAAAAKAA4AAEwAXABsAHwAjAAAhNSM1MzUjNTM1MxUzFSMVMxUjFQE1MxUzNTMVJTUzFSE1MxUBAICAgICAgICAgP8AgICA/gCAAYCAgICAgICAgICAgAKAgICAgICAgICAAAAAAAIAAAAAAIADgAADAAcAADERMxEDETMRgICAAYD+gAIAAYD+gAAAAAAFAAD/gAKAAwAABwALAA8AEwAbAAAFNSM1IRUjFRM1MxUhETMRATUzFSU1MzUzFTMVAQCAAYCAgID9gIABgID+AICAgICAgICAAQCAgAGA/oABAICAgICAgIAAAAMAAAAAAwADgAAHAAsADwAAAREhFSMVMxUXESERBxEhEQEAAQCAgID+AIADAAEAAYCAgICAAoD9gIADgPyAAAABAAABAAGAAwAABwAAGQEhNSE1IREBAP8AAYABAAEAgID+AAAKAAAAAAKAAoAAAwAHAAsADwATABcAGwAfACMAJwAAITUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFQEAgICA/gCAgID+AICAgP8AgICA/wCAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAAAAAQAAAIACgAGAAAUAACU1ITUhEQIA/gACgICAgP8AAAABAIABAAIAAYAAAwAAEzUhFYABgAEAgIAAAAAAAwAAAAADAAOAAAUADQARAAABESERIxUFNSM1MxEhEQcRIREBAAEAgAEAgID+AIADAAEAAYD/AICAgIABgP2AgAOA/IAAAAAAAQAAAwACgAOAAAMAABE1IRUCgAMAgIAAAgAAAgABgAOAAAMABwAAATUjFQcRIREBAICAAYACgICAgAGA/oAAAAIAAP+AAoADAAADAA8AABU1IRUBESE1IREzESEVIRECgP6A/wABAIABAP8AgICAAQABAIABAP8AgP8AAAIAAAIAAQADgAAFAAkAABkBMxUzFQM1MxWAgICAAgABAICAAQCAgAABAAACAAEAA4AABwAAETUzNSM1IRGAgAEAAgCAgID+gAAAAAABAYADAAKAA4AAAwAAATUhFQGAAQADAICAAAAAAQAA/4ACgAMAAAkAABURMxEhETMRIRWAAYCA/gCAA4D9gAKA/QCAAAMAAAAAAoADAAADAA0AEQAAETUzFRMRIzUzNSM1IREzETMRgICAgIABAICAAgCAgP4AAYCAgID9AAMA/QAAAAABAAABgACAAgAAAwAAETUzFYABgICAAAACAID/gAIAAIAAAwAHAAAXNSEVPQEzFYABAICAgICAgIAAAAABAAACgACAA4AAAwAAGQEzEYACgAEA/wAAAAAAAgAAAgABgAOAAAMABwAAATUjFQcRIREBAICAAYACgICAgAGA/oAAAAoAAAAAAoACgAADAAcACwAPABMAFwAbAB8AIwAnAAAxNTMVMzUzFSU1MxUzNTMVJTUzFTM1MxUlNTMVMzUzFSU1MxUzNTMVgICA/wCAgID/AICAgP4AgICA/gCAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAAgAAAAAAoADgAADAAkADQARABUAGQAdACEAADE1MxUhETMVMxUlETMRJTUzFSU1MxU1ETMRJREzESU1MxWAAQCAgP4AgAEAgP6AgID+AIABgICAgAEAgICAAQD/AICAgICAgIABAP8AgAEA/wCAgIAAAAAABwAAAAACgAOAAAMABwANABEAFQAZAB0AADE1MxU1ETMRBTUjESERATUzFTURMxElETMRJTUzFYCAAQCAAQD+gICA/gCAAYCAgICAAQD/AICAAQD+gAGAgICAAQD/AIABAP8AgICAAAAHAAAAAAKAA4AAAwAHAA0AEQAVAB0AIQAAMTUzFTURMxEFNSMRIREBNTMVNREzESE1MzUjNSERATUzFYCAAQCAAQD+gICA/gCAgAEAAQCAgICAAQD/AICAAQD+gAGAgICAAQD/AICAgP6AAQCAgAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVPQEzFSERMxkBNTMVPQEzFQM1MxWAAYCA/YCAgICAgICAgICAAQD/AAEAgICAgIABAICAAAADAAAAAAKAA4AACwAPABMAADERMxUhNTMRIxEhGQE1IRUBNSEVgAGAgID+gAGA/gABAAIAgID+AAEA/wACAICAAQCAgAAAAAADAAAAAAKAA4AACwAPABMAADERMxUhNTMRIxEhGQE1IRUDNSEVgAGAgID+gAGAgAEAAgCAgP4AAQD/AAIAgIABAICAAAUAAAAAAoADgAALAA8AEwAXABsAADERMxUhNTMRIxEhGQE1IRUlNTMVITUzFSU1IRWAAYCAgP6AAYD+AIABgID+AAGAAgCAgP4AAQD/AAIAgICAgICAgICAgAAABQAAAAADAAOAAAsADwAXABsAHwAAMREzFSE1MxEjESERAzUzHQE1ITUhFSMVATUhFSE1MxWAAYCAgP6AgIABAAEAgP6AAQABAIACAICA/gABAP8AAoCAgICAgICAAQCAgICAAAQAAAAAAoADgAALAA8AEwAXAAAxETMVITUzESMRIRkBNSEVATUzFTM1MxWAAYCAgP6AAYD+gICAgAIAgID+AAEA/wACAICAAQCAgICAAAAAAwAAAAACgAOAAAsADwATAAAxETMVITUzESMRIRkBNSEVATUzFYABgICA/oABgP8AgAIAgID+AAEA/wACAICAAQCAgAABAAAAAAKAA4AAFQAAMREzFTM1IzUhFSEVMxUjESEVIREjEYCAgAIA/wCAgAEA/oCAAwCAgICAgID+gIACAP4AAAAAAAcAAP+AAoADgAADAAcACwAPABMAFwAbAAAFNSEVPQEzFSU1IRU9ATMVIREzEQE1MxUlNSEVAQABAID+AAGAgP2AgAGAgP4AAYCAgICAgICAgICAgIACAP4AAYCAgICAgAAAAAACAAAAAAKAA4AACwAPAAAxESEVIRUhFSEVIRUBNSEVAoD+AAEA/wACAP2AAQACgICAgICAAwCAgAAAAAACAAAAAAKAA4AACwAPAAAxESEVIRUhFSEVIRUBNSEVAoD+AAEA/wACAP8AAQACgICAgICAAwCAgAAAAAAFAAAAAAKAA4AACQANABEAFQAZAAAxETMVIRUhFSEVATUhFSU1MxUhNTMVJTUhFYABAP8AAgD+AAGA/gCAAYCA/gABgAIAgICAgAIAgICAgICAgICAgAAAAwAAAAACgAOAAAsADwATAAAxESEVIRUhFSEVIRUBNTMVMzUzFQKA/gABAP8AAgD+AICAgAKAgICAgIADAICAgIAAAAACAAAAAAIAA4AACwAPAAAzNTMRIzUhFSMRMxUBNSEVgICAAYCAgP4AAQCAAYCAgP6AgAMAgIAAAAIAgAAAAoADgAALAA8AADM1MxEjNSEVIxEzFQM1IRWAgIABgICAgAEAgAGAgID+gIADAICAAAAABAAAAAACgAOAAAsADwATABcAADM1MxEjNSEVIxEzFQE1MxUhNTMVJTUhFYCAgAGAgID+AIABgID+AAGAgAGAgID+gIACgICAgICAgIAAAAADAAAAAAGAA4AACwAPABMAADE1MxEjNSEVIxEzFQE1MxUzNTMVgIABgICA/oCAgICAAYCAgP6AgAMAgICAgAAAAgAAAAADAAOAAAMAEwAAJREzEQURIzUzESEVIREzFSMRIRUCgID9gICAAgD+gICAAYCAAoD9gIABgIABgID/AID/AIAAAAAABQAAAAADAAOAAAMACwAVABkAHQAAATUzFQERMxEzFSMRITUjNTMRIzUhEQE1IRUhNTMVAQCA/oCAgIABgICAgAEA/gABAAEAgAEAgID/AAMA/wCA/oCAgAGAgP0AAwCAgICAAAUAAAAAAoADgAADAAcACwAPABMAADM1IRUlETMRIREzEQE1IRUBNSEVgAGA/gCAAYCA/gABgP4AAQCAgIABgP6AAYD+gAGAgIABAICAAAAABQAAAAACgAOAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUhFQM1IRWAAYD+AIABgID+AAGAgAEAgICAAYD+gAGA/oABgICAAQCAgAAAAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAMzUhFSURMxEhETMRATUhFSU1MxUhNTMVJTUhFYABgP4AgAGAgP4AAYD+AIABgID+AAGAgICAAYD+gAGA/oABgICAgICAgICAgIAABwAAAAADAAOAAAMABwALAA8AFwAbAB8AADM1IRUlETMRIREzEQE1Mx0BNSE1IRUjFQE1IRUhNTMVgAGA/gCAAYCA/YCAAQABAID+gAEAAQCAgICAAYD+gAGA/oACAICAgICAgIABAICAgIAABgAAAAACgAOAAAMABwALAA8AEwAXAAAzNSEVJREzESERMxEBNSEVJTUzFSE1MxWAAYD+AIABgID+AAGA/gCAAYCAgICAAgD+AAIA/gACAICAgICAgIAAAAkAAACAAoADAAADAAcACwAPABMAFwAbAB8AIwAAPQEzFSE1MxUlNTMVMzUzFSU1MxUlNTMVMzUzFSU1MxUhNTMVgAGAgP4AgICA/wCA/wCAgID+AIABgICAgICAgICAgICAgICAgICAgICAgICAgAADAAAAAAKAA4AAAwANABcAAAERMxEBNSMRMxEzFSEVNREjNSE1IRUzEQEAgP8AgICAAQCA/wABgIABAAGA/oD/AIACgP4AgICAAgCAgID9gAAAAAAEAAAAAAKAA4AAAwAHAAsADwAAMzUhFSURMxEhETMRATUhFYABgP4AgAGAgP2AAQCAgIACAP4AAgD+AAKAgIAABAAAAAACgAOAAAMABwALAA8AADM1IRUlETMRIREzEQE1IRWAAYD+AIABgID/AAEAgICAAgD+AAIA/gACgICAAAYAAAAAAoADgAADAAcACwAPABMAFwAAMzUhFSURMxEhETMRATUzFSE1MxUlNSEVgAGA/gCAAYCA/YCAAYCA/gABgICAgAGA/oABgP6AAgCAgICAgICAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVJREzESERMxEBNTMVMzUzFYABgP4AgAGAgP4AgICAgICAAgD+AAIA/gACgICAgIAAAAAABgAAAAACgAOAAAMABwALAA8AEwAXAAAhETMRATUzFTM1MxUlNTMVITUzFQE1IRUBAID/AICAgP4AgAGAgP2AAQABgP6AAYCAgICAgICAgIABAICAAAAAAAMAAP+AAoADAAADAAcAEwAAJREzEQE1IRUBETMRMxUjESEVIRUCAID+gAEA/gCAgIABgP6AgAGA/oABgICA/YADgP8AgP8AgIAAAAAEAAAAAAKAA4AAAwANABEAFQAAPQEzHQE1ITUhNSE1MxEBNSEVATUhFYABgP6AAYCA/gABgP4AAQCAgICAgICAgP4AAgCAgAEAgIAABAAAAAACgAOAAAMADQARABUAAD0BMx0BNSE1ITUhNTMRATUhFQM1IRWAAYD+gAGAgP4AAYCAAQCAgICAgICAgP4AAgCAgAEAgIAAAAYAAAAAAoADgAADAA0AEQAVABkAHQAAPQEzHQE1ITUhNSE1MxEBNSEVJTUzFSE1MxUlNSEVgAGA/oABgID+AAGA/gCAAYCA/gABgICAgICAgICA/gACAICAgICAgICAgIAAAAAGAAAAAAMAA4AAAwANABEAGQAdACEAAD0BMx0BNSE1ITUhNTMRATUzHQE1ITUhFSMVATUhFSE1MxWAAYD+gAGAgP2AgAEAAQCA/oABAAEAgICAgICAgICA/gACgICAgICAgIABAICAgIAAAAAFAAAAAAKAA4AAAwANABEAFQAZAAA9ATMdATUhNSE1ITUzEQE1IRUBNTMVMzUzFYABgP6AAYCA/gABgP6AgICAgICAgICAgID+AAIAgIABAICAgIAAAAAABAAAAAACgAOAAAMADQARABUAAD0BMx0BNSE1ITUhNTMRATUhFQE1MxWAAYD+gAGAgP4AAYD/AICAgICAgICAgP4AAgCAgAEAgIAAAAQAAAAAAoACgAADABUAGQAdAAA9ATMdATUzNSM1MzUzFTM1MxEhFSEVATUzFTM1MxWAgICAgICA/wABAP4AgICAgICAgICAgICAgP8AgIACAICAgIAAAAAHAAD/gAKAAwAAAwAHAAsADwATABcAGwAABTUhFT0BMxUlNSEVPQEzFSERMxEBNTMVJTUhFQEAAQCA/gABgID9gIABgID+AAGAgICAgICAgICAgICAAYD+gAEAgICAgIAAAAAABAAAAAACgAOAAAMADQARABUAADM1IRUlETMVITUzESEVETUhFQE1IRWAAgD9gIABgID+AAGA/gABAICAgAGAgID/AIABgICAAQCAgAAAAAAEAAAAAAKAA4AAAwANABEAFQAAMzUhFSURMxUhNTMRIRURNSEVAzUhFYACAP2AgAGAgP4AAYCAAQCAgIABgICA/wCAAYCAgAEAgIAABgAAAAACgAOAAAMADQARABUAGQAdAAAzNSEVJREzFSE1MxEhFRE1IRUlNTMVITUzFSU1IRWAAgD9gIABgID+AAGA/gCAAYCA/gABgICAgAGAgID/AIABgICAgICAgICAgIAAAAUAAAAAAoADgAADAA0AEQAVABkAADM1IRUlETMVITUzESEVETUhFQE1MxUzNTMVgAIA/YCAAYCA/gABgP6AgICAgICAAYCAgP8AgAGAgIABAICAgIAAAAACAAAAAAEAA4AAAwAHAAAzETMRATUhFYCA/wABAAKA/YADAICAAAAAAgAAAAABAAOAAAMABwAAMREzEQM1IRWAgAEAAoD9gAMAgIAABAAAAAACgAOAAAMABwALAA8AACERMxEBNTMVITUzFSU1IRUBAID+gIABgID+AAGAAoD9gAKAgICAgICAgAAAAAMAgAAAAgADgAADAAcACwAAIREzEQE1MxUzNTMVAQCA/wCAgIACgP2AAwCAgICAAAQAAAAAAwADgAADAA8AEwAXAAAhETMRIREzFSE1IRUjFSEZATUhFSE1MxUCAID9gIABAAEAgP6AAQABAIACAP4AAwCAgICA/gADAICAgIAABQAAAAACgAOAAAMABwALAA8AEwAAMzUhFSURMxEhETMRATUhFQE1IRWAAYD+AIABgID+AAGA/gABAICAgAGA/oABgP6AAYCAgAEAgIAAAAAFAAAAAAKAA4AAAwAHAAsADwATAAAzNSEVJREzESERMxEBNSEVAzUhFYABgP4AgAGAgP4AAYCAAQCAgIABgP6AAYD+gAGAgIABAICAAAAAAAcAAAAAAoADgAADAAcACwAPABMAFwAbAAAzNSEVJREzESERMxEBNSEVJTUzFSE1MxUlNSEVgAGA/gCAAYCA/gABgP4AgAGAgP4AAYCAgIABgP6AAYD+gAGAgICAgICAgICAgAAHAAAAAAMAA4AAAwAHAAsADwAXABsAHwAAMzUhFSURMxEhETMRATUzHQE1ITUhFSMVATUhFSE1MxWAAYD+AIABgID9gIABAAEAgP6AAQABAICAgIABgP6AAYD+gAIAgICAgICAgAEAgICAgAAGAAAAAAKAA4AAAwAHAAsADwATABcAADM1IRUlETMRIREzEQE1IRUBNTMVMzUzFYABgP4AgAGAgP4AAYD+gICAgICAgAGA/oABgP6AAYCAgAEAgICAgAAAAwAAAIACgAMAAAMABwALAAAlNTMVATUhFQE1MxUBAID+gAKA/oCAgICAAQCAgAEAgIAAAAMAAAAAAoACgAADAA0AFwAAATUzFQE1IxEzETMVIRU1ESM1ITUhFTMRAQCA/wCAgIABAID/AAGAgAEAgID/AIABgP8AgICAAQCAgID+gAAAAwAAAAACgAOAAAMACQANAAA1ETMRFTUhETMRATUhFYABgID9gAEAgAIA/gCAgAIA/YADAICAAAADAAAAAAKAA4AAAwAJAA0AADURMxEVNSERMxEBNSEVgAGAgP8AAQCAAgD+AICAAgD9gAMAgIAAAAUAAAAAAoADgAADAAkADQARABUAADURMxEVNSERMxEBNTMVITUzFSU1IRWAAYCA/YCAAYCA/gABgIABgP6AgIABgP4AAoCAgICAgICAAAAABAAAAAACgAOAAAMACQANABEAADURMxEVNSERMxEBNTMVMzUzFYABgID+AICAgIACAP4AgIACAP2AAwCAgICAAAQAAP+AAoADgAADAAcADwATAAAXNSEVAREzEQE1ITUhETMRATUhFYABgP4AgAGA/oABgID9gAEAgICAAYABgP6A/wCAgAGA/YADAICAAAAAAwAA/4ACgAOAAAMABwATAAAlETMRATUhFQERMxEzFSMRIRUhFQIAgP6AAQD+AICAgAGA/oCAAYD+gAGAgID9gAQA/oCA/wCAgAAAAAUAAP+AAoADgAADAAcADwATABcAABc1IRUBETMRATUhNSERMxEBNTMVMzUzFYABgP4AgAGA/oABgID+AICAgICAgAGAAYD+gP8AgIABgP2AAwCAgICAAAACAAAAAAKAA4AAAwATAAA1ETMRFTUzESM1IRUhFTMVIxEhFYCAgAIA/wCAgAEAgAKA/YCAgAKAgICAgP6AgAAABQAAAAACgAKAAAMABwALAA8AGwAAMzUzFTM1IRUlETMZATUzFRkBMxUzNSM1IREhFYCAgAEA/YCAgICAgAEA/wCAgICAgAGA/oABgICA/oABgICAgP6AgAAAAAAHAAAAAAKAA4AAAwAHAAsADwATABcAGwAAIREzEQE1MxUzNTMVJTUzFSE1MxUBNTMVMzUzFQEAgP8AgICA/gCAAYCA/gCAgIABgP6AAYCAgICAgICAgIABAICAgIAAAAABAAABgAMAAgAAAwAAETUhFQMAAYCAgAACAAACAAEAA4AAAwAHAAAZATMZATUzFYCAAgABAP8AAQCAgAACAAACAAEAA4AAAwAHAAARNTMVNREzEYCAAgCAgIABAP8AAAACAAD/gAEAAQAAAwAHAAAVNTMVNREzEYCAgICAgAEA/wAAAAACAAACAAEAA4AAAwAHAAATNTMVJREzEYCA/wCAAgCAgIABAP8AAAAABAAAAgACAAOAAAMABwALAA8AABkBMxEzETMRATUzFTM1MxWAgID/AICAgAIAAQD/AAEA/wABAICAgIAABAAAAgACAAOAAAMABwALAA8AABE1MxUzNTMVJREzETMRMxGAgID/AICAgAIAgICAgIABAP8AAQD/AAAABAAA/4ACAAEAAAMABwALAA8AABU1MxUzNTMVJREzETMRMxGAgID/AICAgICAgICAgAEA/wABAP8AAAAAAQAAAAABgAMAAAsAADMRIzUzETMRMxUjEYCAgICAgAGAgAEA/wCA/oAAAAABAAABgAEAAoAAAwAAGQEhEQEAAYABAP8AAAAAAwAAAAACgACAAAMABwALAAAxNTMVMzUzFTM1MxWAgICAgICAgICAgAAAAAADAAAAAAEAAYAAAwAHAAsAADM1MxUlNTMVPQEzFYCA/wCAgICAgICAgICAAAMAAAAAAQABgAADAAcACwAAMTUzFT0BMxUlNTMVgID/AICAgICAgICAgAAAAwAAAAACgAOAAAMAFwAbAAAhNSEVJTUjNTM1IzUzNTMVIRUhFSEVIRURNSEVAQABgP4AgICAgIABAP8AAQD/AAGAgICAgICAgICAgICAgAKAgIAAAgAAAgAEgAOAAAcAEwAAExEjNSEVIxEhESERIxEjFSM1IxGAgAGAgAEAAoCAgICAAgABAICA/wABgP6AAQCAgP8AAAAAACABhgABAAAAAAAAASUCTAABAAAAAAABAAkDhgABAAAAAAACAAcDoAABAAAAAAADABEDzAABAAAAAAAEABEEAgABAAAAAAAFAAsELAABAAAAAAAGAAkETAABAAAAAAAHAGMFHgABAAAAAAAIABYFsAABAAAAAAAJAAUF0wABAAAAAAAKASUIJQABAAAAAAALAB8JiwABAAAAAAAMABEJzwABAAAAAAANACgKMwABAAAAAAAOAC4KugABAAAAAAATABsLIQADAAEECQAAAkoAAAADAAEECQABABIDcgADAAEECQACAA4DkAADAAEECQADACIDqAADAAEECQAEACID3gAD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IgAgAGYAbwBuAHQAIABpAHMAIAB1AG4AZABlAHIAIABDAHIAZQBhAHQAaQB2AGUAIABDAG8AbQBtAG8AbgBzACAATABpAGMAZQBuAHMAZQAgACgAUwBoAGEAcgBlACAAQQBsAGkAawBlACkALgANAAoADQAKAFQAaABlACAAIgBEAGoARABDAEgAIgAgAG4AYQBtAGUAIABpAHMAIABvAHcAbgAgAGIAeQAgAG0AZQAgACgAZABqAGQAYwBoAC4AYwBvAG0AKQAuAA0ACgANAAoAVABoAGUAIAAiAE0AaQBuAGUAYwByAGEAZgB0ACIAIABmAG8AbgB0ACAAcwB0AHkAbABlACAAdwBhAHMAIABtAGEAZABlACAAYgB5ACAATgBvAHQAYwBoAC4ADQAKAA0ACgBUAGgAZQAgACIATQBpAG4AZQBjAHIAYQBmAHQAIgAgAGcAYQBtAGUAIABpAHMAIABvAHcAbgAgAGIAeQAgAE0AbwBqAGEAbgBnACAAUwBwAGUAYwBpAGYAaQBjAGEAdABpAG8AbgBzAC4AAFRoaXMgIk1pbmVjcmFmdCIgZm9udCB3YXMgYWRhcHRlZCBpbnRvIFRydWVUeXBlIGZpbGUgYnkgbWUgKERqRENIKS4NCg0KVGhpcyAiTWluZWNyYWZ0IiBmb250IGlzIHVuZGVyIENyZWF0aXZlIENvbW1vbnMgTGljZW5zZSAoU2hhcmUgQWxpa2UpLg0KDQpUaGUgIkRqRENIIiBuYW1lIGlzIG93biBieSBtZSAoZGpkY2guY29tKS4NCg0KVGhlICJNaW5lY3JhZnQiIGZvbnQgc3R5bGUgd2FzIG1hZGUgYnkgTm90Y2guDQoNClRoZSAiTWluZWNyYWZ0IiBnYW1lIGlzIG93biBieSBNb2phbmcgU3BlY2lmaWNhdGlvbnMuAABoAHQAdABwADoALwAvAGYAbwBuAHQAcwB0AHIAdQBjAHQALgBmAG8AbgB0AHMAaABvAHAALgBjAG8AbQAvAABodHRwOi8vZm9udHN0cnVjdC5mb250c2hvcC5jb20vAABoAHQAdABwADoALwAvAGQAagBkAGMAaAAuAGMAbwBtAC8AAGh0dHA6Ly9kamRjaC5jb20vAABDAHIAZQBhAHQAaQB2AGUAIABDAG8AbQBtAG8AbgBzACAAQQB0AHQAcgBpAGIAdQB0AGkAbwBuACAAUwBoAGEAcgBlACAAQQBsAGkAawBlAABDcmVhdGl2ZSBDb21tb25zIEF0dHJpYnV0aW9uIFNoYXJlIEFsaWtlAABoAHQAdABwADoALwAvAGMAcgBlAGEAdABpAHYAZQBjAG8AbQBtAG8AbgBzAC4AbwByAGcALwBsAGkAYwBlAG4AcwBlAHMALwBiAHkALQBzAGEALwAzAC4AMAAvAABodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9saWNlbnNlcy9ieS1zYS8zLjAvAABNAGkAbgBlAGMAcgBhAGYAdAAgAGkAcwAgAGoAdQBzAHQAIABhAHcAZQBzAG8AbQBlACAAIQAATWluZWNyYWZ0IGlzIGp1c3QgYXdlc29tZSAhAAAAAgAAAAAAAABlADMAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAABAgEDAAMABAAFAAYABwAIAAkACgALAAwADQAOAA8AEAARABIAEwAUABUAFgAXABgAGQAaABsAHAAdAB4AHwAgACEAIgAjACQAJQAmACcAKAApACoAKwAsAC0ALgAvADAAMQAyADMANAA1ADYANwA4ADkAOgA7ADwAPQA+AD8AQABBAEIAQwBEAEUARgBHAEgASQBKAEsATABNAE4ATwBQAFEAUgBTAFQAVQBWAFcAWABZAFoAWwBcAF0AXgBfAGAAYQCjAIQAhQC9AJYA6ACOAIsAnQCpAKQBBACKANoAgwCTAQUBBgCNAQcAiADDAN4BCACeAKoA9QD0APYAogCtAMkAxwCuAGIAYwCQAGQAywBlAMgAygDPAMwAzQDOAOkAZgDTANAA0QCvAGcA8ACRANYA1ADVAGgA6wDtAGoAaQBrAG0AbABuAKAAbwBxAHAAcgBzAHUAdAB2AHcAeAB6AHkAewB9AHwAuAChAH8AfgCAAIEA7ADuALoAsACxALsAswC2ALcAxAEJALQAtQDFAIIAhwCrAL4AvwEKAIwGZ2x5cGgxB3VuaTAwMEQHdW5pMDBBRAd1bmkwMEIyB3VuaTAwQjMHdW5pMDBCNQd1bmkwMEI5DXF1b3RlcmV2ZXJzZWQERXVybwAAAAH//wACAAEAAAAOAAAAGAAAAAAAAgABAAEAzwABAAQAAAACAAAAAAABAAAAAMw9os8AAAAAyO86mAAAAADI8I+a",0),new android.os.Environment.getExternalStorageDirectory()+"/games/com.mojang/minecraftpe/minecraft.ttf")
var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
var MinecraftFont = new android.graphics.Typeface.createFromFile(new android.os.Environment.getExternalStorageDirectory()+"/games/com.mojang/minecraftpe/minecraft.ttf");

//@Desno365's Immersive Mode Support
function ScreenWidth (){
		if(android.os.Build.VERSION.SDK_INT>=17){
				var uiFlags = ctx.getWindow().getDecorView().getSystemUiVisibility();
				if((uiFlags&android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION)!==0){
						var metrics = new android.util.DisplayMetrics();
						ctx.getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
						var realWidth = metrics.widthPixels;
						var realHeight = metrics.heightPixels;
						if(realHeight>realWidth){
								var x = realHeight;
								realHeight = realWidth;
								realWidth = x;								
						}
						return realWidth;
				}else{
						return ctx.getScreenWidth();
				}
		}else{
				return ctx.getScreenWidth();
		}
}
function ScreenHeight(){
		if(android.os.Build.VERSION.SDK_INT>=17){
				var uiFlags = ctx.getWindow().getDecorView().getSystemUiVisibility();
				if((uiFlags&android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION)!==0){
						var metrics = new android.util.DisplayMetrics();
						ctx.getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
						var realWidth = metrics.widthPixels;
						var realHeight = metrics.heightPixels;
						if(realHeight>realWidth){
								var x = realHeight;
								realHeight = realWidth;
								realWidth = x;								
						}
						return realHeight;
				}else{
						return ctx.getScreenHeight();
				}
		}else{
				return ctx.getScreenHeight();
		}
}
function UiThread(functionToRun){
		ctx.runOnUiThread(new java.lang.Runnable(){
				run:function(){
						try{
								functionToRun();
						}catch(e){
								clientMessage("Error: "+e);
						}
				}
		});
}
function AddTouchFunction(myView,pressAction,unpressAction){
		myView.setOnTouchListener(new android.view.View.OnTouchListener(){
				onTouch:function(v,event){
						switch(event.getAction()){
								case 0:pressAction(v,event);break;
								case 1:unpressAction(v,event);break;
						}return false;
				}
		});
}
function AddClickFunction(myView,clickAction){
		myView.setOnClickListener(new android.view.View.OnClickListener(){
				onClick:function(v){
						clickAction(v);
				}
		});
}
function AddLongClickFunction(myView,clickAction){
		myView.setOnLongClickListener(new android.view.View.OnLongClickListener(){
				onLongClick:function(v,t){
						clickAction(v,t);
						return true;
				}
		});
}
function MinecraftText(textView,text,shadow,textSize){
		var colors = [[" ","&nbsp;&nbsp;"],["\n","<br/>"],["§l","</b><b>"],["§m","</del><del>"],["§n","</ins><ins>"],["§o","</i><i>"],["§r","</font>"],["§0","</font><font color=#000000>"],["§1","</font><font color=#0000AA>"],["§2","</font><font color=#00AA00>"],["§3","</font><font color=#00AAAA>"],["§4","</font><font color=#AA0000>"],["§5","</font><font color=#AA00AA>"],["§6","</font><font color=#FFAA00>"],["§7","</font><font color=#AAAAAA>"],["§8","</font><font color=#555555>"],["§9","</font><font color=#5555FF>"],["§a","</font><font color=#55FF55>"],["§b","</font><font color=#55FFFF>"],["§c","</font><font color=#FF5555>"],["§d","</font><font color=#FF55FF>"],["§e","</font><font color=#FFFF55>"],["§f","</font><font color=#FFFFFF>"]];
		colors.forEach((e,i)=>{text = text.split(e[0]).join(e[1]);});
		textSize = textSize||dp(8);
		textView.setText(android.text.Html.fromHtml(text));		
		textView.setTypeface(MinecraftFont);
		textView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX,textSize);
		textView.setTextColor(android.graphics.Color.parseColor("#E1E1E1"));
		textView.setLayerType(android.view.View.LAYER_TYPE_SOFTWARE,null);
		textView.setPaintFlags(textView.getPaintFlags()|android.graphics.Paint.SUBPIXEL_TEXT_FLAG);
		textView.setAllCaps(false);
		if(shadow===true)textView.setShadowLayer(0.00001,Math.ceil(dp(textSize/dp(8))),Math.ceil(dp(textSize/dp(8))),android.graphics.Color.DKGRAY);
}
function CreateLayoutView(widgetType,x,y,width,height){
		var LayoutWidget = widgetType;
		var LayoutParams = new android.widget.RelativeLayout.LayoutParams(width,height);
		LayoutParams.setMargins(x,y,0,0);
		LayoutWidget.setLayoutParams(LayoutParams);
		return LayoutWidget;
}
var BitmapUtils = {
		getDrawable:(bitmap) => new android.graphics.drawable.BitmapDrawable(bitmap),
		getFromTexture:(direction) => new android.graphics.BitmapFactory.decodeStream(ModPE.openInputStreamFromTexturePack("images/"+direction)),
		getTrimmed:(bitmap,x,y,width,height) => new android.graphics.Bitmap.createBitmap(bitmap,x,y,width,height),
		getScaled:(bitmap,scaleX,scaleY) => new android.graphics.Bitmap.createScaledBitmap(bitmap,scaleX,scaleY,false),
		ultimateDrawable:(direction,x,y,width,height,scaleX,scaleY) => BitmapUtils.getDrawable(BitmapUtils.getScaled(BitmapUtils.getTrimmed(BitmapUtils.getFromTexture(direction),x,y,width,height),scaleX||dp(width),scaleY||dp(height))),
		//Affogatoman(@dfak0557)'s Method
		stretchImage:(bm,x,y,stretchWidth,stretchHeight,width,height) => {
				var blank = android.graphics.Bitmap.createBitmap(width,height,android.graphics.Bitmap.Config.ARGB_8888);
				var Bitmap = android.graphics.Bitmap;
				var part1 = Bitmap.createBitmap(bm,0,0,x,y);
				var part2 = Bitmap.createBitmap(bm,x,0,stretchWidth,y);
				var part3 = Bitmap.createBitmap(bm,x+stretchWidth,0,bm.getWidth()-x-stretchWidth,y);
				var part4 = Bitmap.createBitmap(bm,0,y,x,stretchHeight);
				var part5 = Bitmap.createBitmap(bm,x,y,stretchWidth,stretchHeight);
				var part6 = Bitmap.createBitmap(bm,x+stretchWidth,y,bm.getWidth()-x-stretchWidth,stretchHeight);
				var part7 = Bitmap.createBitmap(bm,0,y+stretchHeight,x,bm.getHeight()-y-stretchHeight);
				var part8 = Bitmap.createBitmap(bm,x,y+stretchHeight,stretchWidth,bm.getHeight()-y-stretchHeight);
				var part9 = Bitmap.createBitmap(bm,x+stretchWidth,y+stretchHeight,bm.getWidth()-x-stretchWidth,bm.getHeight()-y-stretchHeight);
				var canvas = new android.graphics.Canvas(blank);
				canvas.drawBitmap(part1,0,0,null);
				canvas.drawBitmap(Bitmap.createScaledBitmap(part2,width-bm.getWidth()+stretchWidth,y,false),x,0,null);
				canvas.drawBitmap(part3,width-bm.getWidth()+stretchWidth+x,0,null);
				canvas.drawBitmap(Bitmap.createScaledBitmap(part4,x,height-bm.getHeight()+stretchHeight,false),0,y,null);
				canvas.drawBitmap(Bitmap.createScaledBitmap(part5,width-bm.getWidth()+stretchWidth,height-bm.getHeight()+stretchHeight,false),x,y,null);
				canvas.drawBitmap(Bitmap.createScaledBitmap(part6,part3.getWidth(),height-bm.getHeight()+stretchHeight,false),width-bm.getWidth()+stretchWidth+x,y,null);
				canvas.drawBitmap(part7,0,height-bm.getHeight()+stretchHeight+y,null);
				canvas.drawBitmap(Bitmap.createScaledBitmap(part8,width-bm.getWidth()+stretchWidth,part7.getHeight(),false),x,height-bm.getHeight()+stretchHeight+y,null);
				canvas.drawBitmap(part9,width-bm.getWidth()+stretchWidth+x,height-bm.getHeight()+stretchHeight+y,null);
				return new android.graphics.drawable.BitmapDrawable(blank);
		}
};
var Background = {
		itemIcon:function(name,data){
				eval("var meta = "+new java.lang.String(ModPE.getBytesFromTexturePack("images/items.meta"))+";");
				var metaMapped = meta.map(e=>e.name);	
				var items = net.zhuoweizhang.mcpelauncher.texture.tga.TGALoader.load(ModPE.openInputStreamFromTexturePack("images/items-opaque.tga"),false);
				var uvs = meta[metaMapped.indexOf(name)].uvs[data];
				return BitmapUtils.getDrawable(BitmapUtils.getScaled(BitmapUtils.getTrimmed(items,uvs[0],uvs[1],uvs[2]-uvs[0],uvs[3]-uvs[1]),dp(uvs[2]-uvs[0]),dp(uvs[3]-uvs[1])));
		},
		dirtWall:function(){
				var background = BitmapUtils.getDrawable(BitmapUtils.getScaled(BitmapUtils.getFromTexture("gui/background.png"),dp(32),dp(32)));
				background.setTileModeXY(android.graphics.Shader.TileMode.REPEAT,android.graphics.Shader.TileMode.REPEAT);
				background.setColorFilter(android.graphics.Color.rgb(60,60,60),android.graphics.PorterDuff.Mode.MULTIPLY);
				return background;
		},
		progressRect:function(width,progress,color){
				var blank = android.graphics.Bitmap.createBitmap(width,dp(9),android.graphics.Bitmap.Config.ARGB_8888);
				var canvas = new android.graphics.Canvas(blank);
				var paint = new android.graphics.Paint();
				paint.setColor(android.graphics.Color.rgb(125,125,125));
				canvas.drawRect(0,0,width,dp(4),paint);
				paint.setColor(color||android.graphics.Color.rgb(125,255,125));
				canvas.drawRect(0,0,progress,dp(4),paint);
				return BitmapUtils.getDrawable(blank);
		},
		slider:function(width,sections){
				var blank = android.graphics.Bitmap.createBitmap(width,dp(17),android.graphics.Bitmap.Config.ARGB_8888);
				var canvas = new android.graphics.Canvas(blank);
				var paint = new android.graphics.Paint();
				paint.setColor(android.graphics.Color.rgb(115,113,115));
				canvas.drawRect(dp(5.5),dp(6.8),width-dp(5.5),dp(10.2),paint);
				paint.setColor(android.graphics.Color.rgb(148,148,148));		
				for(let i=0;i<sections+1;i++){
							canvas.drawRect(dp(5.5)+(width-dp(11))/sections*i-dp(2.25),dp(4.5),dp(5.5)+(width-dp(11))/sections*i+dp(2.25),dp(12.25),paint);
				}
				return BitmapUtils.getDrawable(blank);
		}
};
var ModPEGUI = {
		imageButton:function(unpressedImage,pressedImage,x,y,width,height,action){
				var unpressed = unpressedImage;
				var pressed = pressedImage;
				var button = CreateLayoutView(new android.widget.ImageView(ctx),x,y,width,height);	
				button.setBackgroundDrawable(unpressedImage);
				button.setClickable(true);
				button.setOnTouchListener(new android.view.View.OnTouchListener({
						onTouch:function(view,event){
								switch(event.getAction()){
										case android.view.MotionEvent.ACTION_DOWN:view.setBackgroundDrawable(pressed);break;
										case android.view.MotionEvent.ACTION_MOVE:if(event.getX()<0||event.getY()<0||event.getX()>width||event.getY()>height){view.setBackgroundDrawable(unpressed);var current = true;}else if(!current){view.setBackgroundDrawable(pressed);}break;
										case android.view.MotionEvent.ACTION_UP:view.setBackgroundDrawable(unpressed);if(current!==false&&!(event.getX()<0||event.getY()<0||event.getX()>(width)||event.getY()>height)){Level.playSoundEnt(Player.getEntity(),"random.click");if(typeof action==="function")action();}var current = false;break;
										case android.view.MotionEvent.ACTION_CANCEL:view.setBackgroundDrawable(unpressed);var current = false;break;
								}return false;
						}
				}));return button;
		},
		minecraftButton:function(text,x,y,width,height,action){
				var unpressed = BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),width,height);
				var pressed = BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",0,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),width,height);
				var button = CreateLayoutView(new android.widget.Button(ctx),x,y,width,height);
				button.setBackgroundDrawable(unpressed);
				button.setPadding(0,dp(1),0,0);
				MinecraftText(button,text,true);
				button.setOnTouchListener(new android.view.View.OnTouchListener({
						onTouch:function(view,event){
								switch(event.getAction()){
										case android.view.MotionEvent.ACTION_DOWN:view.setBackgroundDrawable(pressed);view.setTextColor(android.graphics.Color.parseColor("#FFFFA1"));view.setPadding(view.getPaddingLeft(),dp(2),view.getPaddingRight(),view.getPaddingBottom());break;
										case android.view.MotionEvent.ACTION_MOVE:if(event.getX()<0||event.getY()<0||event.getX()>width||event.getY()>height){view.setBackgroundDrawable(unpressed);view.setTextColor(android.graphics.Color.parseColor("#E1E1E1"));view.setPadding(view.getPaddingLeft(),dp(1),view.getPaddingRight(),view.getPaddingBottom());var current = true;}else if(!current){view.setTextColor(android.graphics.Color.parseColor("#FFFFA1"));view.setBackgroundDrawable(pressed);view.setPadding(view.getPaddingLeft(),dp(2),view.getPaddingRight(),view.getPaddingBottom());}break;
										case android.view.MotionEvent.ACTION_UP:view.setTextColor(android.graphics.Color.parseColor("#E1E1E1"));view.setBackgroundDrawable(unpressed);view.setPadding(view.getPaddingLeft(),dp(1),view.getPaddingRight(),view.getPaddingBottom());if(current!==false&&!(event.getX()<0||event.getY()<0||event.getX()>(width)||event.getY()>height)){Level.playSoundEnt(Player.getEntity(),"random.click");if(typeof action==="function")action();}var current = false;break;
										case android.view.MotionEvent.ACTION_CANCEL:view.setTextColor(android.graphics.Color.parseColor("#E1E1E1"));view.setBackgroundDrawable(unpressed);view.setPadding(view.getPaddingLeft(),dp(1),view.getPaddingRight(),view.getPaddingBottom());var current = false;break;
								}return false;
						}
				}));return button;
		},
		minecraftImageButton:function(bitmap,x,y,width,height,action){
				var unpressed = BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",8,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),width,height);
				var pressed = BitmapUtils.stretchImage(BitmapUtils.ultimateDrawable("gui/spritesheet.png",0,32,8,8).getBitmap(),dp(2),dp(2),dp(4),dp(4),width,height);
				var button = CreateLayoutView(new android.widget.ImageView(ctx),x,y,width,height);
				button.setScaleType(android.widget.ImageView.ScaleType.CENTER);
				button.setBackgroundDrawable(unpressed);
				button.setImageBitmap(bitmap);
				button.setPadding(0,0,0,0);
				button.setClickable(true);
				button.setOnTouchListener(new android.view.View.OnTouchListener({
						onTouch:function(view,event){
								switch(event.getAction()){
										case android.view.MotionEvent.ACTION_DOWN:view.setBackgroundDrawable(pressed);view.setPadding(view.getPaddingLeft(),dp(1),view.getPaddingRight(),view.getPaddingBottom());break;
										case android.view.MotionEvent.ACTION_MOVE:if(event.getX()<0||event.getY()<0||event.getX()>width||event.getY()>height){view.setBackgroundDrawable(unpressed);view.setPadding(view.getPaddingLeft(),0,view.getPaddingRight(),view.getPaddingBottom());var current = true;}else if(!current){view.setBackgroundDrawable(pressed);view.setPadding(view.getPaddingRight(),dp(1),view.getPaddingTop(),view.getPaddingBottom());}break;
										case android.view.MotionEvent.ACTION_UP:view.setBackgroundDrawable(unpressed);view.setPadding(view.getPaddingRight(),0,view.getPaddingRight(),view.getPaddingBottom());if(current!==false&&!(event.getX()<0||event.getY()<0||event.getX()>(width)||event.getY()>height)){Level.playSoundEnt(Player.getEntity(),"random.click");if(typeof action==="function")action();}var current = false;break;
										case android.view.MotionEvent.ACTION_CANCEL:view.setBackgroundDrawable(unpressed);view.setPadding(view.getPaddingRight(),0,view.getPaddingRight(),view.getPaddingBottom());var current = false;break;
								}return false;
						}
				}));return button;
		},
		minecraftLabel:function(text,x,y,width,height,shadow,size,gravity,lineSpacing){
				var textView = CreateLayoutView(new android.widget.TextView(ctx),x,y,width,height);
				textView.setGravity(gravity||android.view.Gravity.CENTER);
				textView.setLineSpacing(lineSpacing||0,1);
				MinecraftText(textView,text,shadow,size);
				return textView;
		},
		minecraftSlider:function(x,y,width,sections,max){
				var slider = CreateLayoutView(new android.widget.SeekBar(ctx),x,y,width,dp(17));
				slider.getProgressDrawable().setColorFilter(android.graphics.Color.TRANSPARENT,android.graphics.PorterDuff.Mode.MULTIPLY);
				slider.setBackgroundDrawable(Background.slider(width,sections));
				slider.setThumb(BitmapUtils.ultimateDrawable("gui/touchgui.png",225,125,11,17,dp(33*PocketManager.settings.THUMB_SIZE),dp(51*PocketManager.settings.THUMB_SIZE)));
				slider.setPadding(dp(5.5),0,dp(5.5),0);
				slider.setMax(max||100);
				return slider;
		},
		minecraftSwitch:function(defaultState,x,y,activeAction,deactiveAction){
				var active = BitmapUtils.ultimateDrawable("gui/touchgui.png",198,206,38,19).getBitmap();
				var deactive = BitmapUtils.ultimateDrawable("gui/touchgui.png",160,206,38,19).getBitmap();
				var mcSwitch = CreateLayoutView(new android.widget.ImageView(ctx),x,y,dp(38),dp(19));
				mcSwitch.setImageBitmap(defaultState==="off" ? deactive:active);
				mcSwitch.setTag(defaultState==="off" ? false:true);
				mcSwitch.setClickable(true);
				mcSwitch.setOnTouchListener(new android.view.View.OnTouchListener({
						onTouch:function(view,event){
								switch(event.getAction()){
										case android.view.MotionEvent.ACTION_DOWN:view.setPadding(dp(0.5),dp(0.5),dp(0.5),dp(0.5));if(view.getTag()==true){if(typeof deactiveAction==="function")deactiveAction();view.setImageBitmap(deactive);view.setTag(false);}else{if(typeof activeAction==="function")activeAction();view.setImageBitmap(active);view.setTag(true);}break;			
										case android.view.MotionEvent.ACTION_MOVE:if(event.getX()<0||event.getY()<0||event.getX()>dp(38)||event.getY()>dp(19)){view.setPadding(0,0,0,0);var current = true;}else if(!current)view.setPadding(dp(0.5),dp(0.5),dp(0.5),dp(0.5));break;							
										case android.view.MotionEvent.ACTION_UP:view.setPadding(0,0,0,0);if(current!==false&&!(event.getX()<0||event.getY()<0||event.getX()>dp(38)||event.getY()>dp(19))){Level.playSoundEnt(Player.getEntity(),"random.click");if(typeof action==="function")action();}var current = false;break;
										case android.view.MotionEvent.ACTION_CANCEL:view.setPadding(0,0,0,0);var current = false;break;
								}return false;
						}
				}));return mcSwitch;
		},
		screenHeader:function(text,width){
				var body = new android.widget.RelativeLayout(ctx);			
				var center = CreateLayoutView(new android.widget.TextView(ctx),0,0,width||ScreenWidth(),dp(25));
				center.setBackgroundDrawable(BitmapUtils.ultimateDrawable("gui/touchgui.png",153,26,8,25,width||ScreenWidth(),dp(25)));		
				center.setGravity(android.view.Gravity.CENTER);
				center.setPadding(dp(3),dp(1),dp(3),0);
				MinecraftText(center,text,true);		
				body.addView(center);			
				var left = CreateLayoutView(new android.widget.ImageView(ctx),0,0,dp(2),dp(25));
				left.setBackgroundDrawable(BitmapUtils.ultimateDrawable("gui/touchgui.png",150,26,2,25));
				body.addView(left);				
				var right = CreateLayoutView(new android.widget.ImageView(ctx),(width||ScreenWidth())-dp(2),0,dp(2),dp(25));
				right.setBackgroundDrawable(BitmapUtils.ultimateDrawable("gui/touchgui.png",162,26,2,25));
				body.addView(right);		
				var bottom = CreateLayoutView(new android.widget.ImageView(ctx),0,dp(25),width||ScreenWidth(),dp(3));
				bottom.setBackgroundDrawable(BitmapUtils.ultimateDrawable("gui/touchgui.png",153,52,8,3,width||ScreenWidth(),dp(3)));
				body.addView(bottom);		
				return body;
		}
};
//Affogatoman(@dfak0557)'s Block Render API
var BlockImageLoader = {TGA:null,META:null,META_MAPPED:null,MTRX:null,CANVAS:null,SIZE:8};
var BlockType = {NONE:0,CUBE:1,STAIR:2,SLAB:3,SNOW:4,PLATE:5,CARPET:5,TRAPDOOR:6,FENCE:7,PATHGRASS:8,STONEWALL:9,ENDPORTAL:10,ENCHANT_TABLE:11,DAYLIGHTSENSOR:12,BUTTON:13,FENCEGATE:14};
var bs = size => BlockImageLoader.SIZE*size;
BlockImageLoader.init = function(tga){
		if(tga instanceof android.graphics.Bitmap)
				BlockImageLoader.TGA = tga;
		if(BlockImageLoader.META == null)
				BlockImageLoader.META = JSON.parse(new java.lang.String(ModPE.getBytesFromTexturePack("images/terrain.meta"))+'');
		if(BlockImageLoader.META_MAPPED == null)
				BlockImageLoader.META_MAPPED = BlockImageLoader.META.map(e=>e.name);
    if(BlockImageLoader.TGA == null)
        BlockImageLoader.TGA = net.zhuoweizhang.mcpelauncher.texture.tga.TGALoader.load(ModPE.openInputStreamFromTexturePack("images/terrain-atlas.tga"), false);
    if(BlockImageLoader.MTRX == null)
        BlockImageLoader.MTRX = new android.graphics.Matrix();
    if(BlockImageLoader.CANVAS == null)
        BlockImageLoader.CANVAS = new android.graphics.Canvas();
};
BlockImageLoader.getBlockBitmap = function(name,data){
		if(BlockImageLoader.META_MAPPED.indexOf(name) < 0)
				throw new Error(name+","+data+" not found");
				//return android.graphics.Bitmap.createBitmap(1, 1, android.graphics.Bitmap.Config.RGB_565);
		var uvs = BlockImageLoader.META[BlockImageLoader.META_MAPPED.indexOf(name)].uvs[data];
		iolo = uvs[0]+","+uvs[1]+","+uvs[2]+","+uvs[3]+","+uvs[4]+""+uvs[5];
		var x = uvs[0];
    var y = uvs[1];
    var width = uvs[2]-x;
    var height = uvs[3]-y;
    return android.graphics.Bitmap.createScaledBitmap(android.graphics.Bitmap.createBitmap(BlockImageLoader.TGA, x, y, width, height), bs(32), bs(32), false);
};
BlockImageLoader.create = function(left, top, right, renderType, hasNoShadow){
    if(BlockImageLoader.TGA == null || BlockImageLoader.META == null)
        throw new Error("BlockImageLoader hasn't been initialized");
    if(!Array.isArray(left) || !Array.isArray(right) || !Array.isArray(top))
        throw new Error("Illegal argument type");
    temp = android.graphics.Bitmap.createBitmap(bs(51), bs(57), android.graphics.Bitmap.Config.ARGB_8888);
    left = BlockImageLoader.getBlockBitmap(left[0], left[1]);
    right = BlockImageLoader.getBlockBitmap(right[0], right[1]);
    top = BlockImageLoader.getBlockBitmap(top[0], top[1]);
    switch(renderType){
        case BlockType.CUBE:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 32);break;
        case BlockType.STAIR:temp = BlockImageLoader.createStair(left, right, top, temp, hasNoShadow);break;
        case BlockType.SLAB:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 16);break;
        case BlockType.SNOW:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 4);break;
        case BlockType.CARPET:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 2);break;
        case BlockType.TRAPDOOR:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 6);break;
        case BlockType.FENCE:temp = BlockImageLoader.createFence(left, right, top, temp, hasNoShadow);break;
				case BlockType.PATHGRASS:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 30);break;
				case BlockType.STONEWALL:temp = BlockImageLoader.createWall(left, right, top, temp, hasNoShadow);break;
				case BlockType.ENDPORTAL:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 26);break;
				case BlockType.ENCHANT_TABLE:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 24);break;
				case BlockType.DAYLIGHTSENSOR:temp = BlockImageLoader.createCube(left, right, top, temp, hasNoShadow, 12);break;
				case BlockType.BUTTON:temp = BlockImageLoader.createButton(left, right, top, temp, hasNoShadow);break;
				case BlockType.FENCEGATE:temp = BlockImageLoader.createFenceGate(left, right, top, temp, hasNoShadow);break;
        default:temp = android.graphics.Bitmap.createScaledBitmap(left, dp(15), dp(15), false);break;
    }return temp;
};
BlockImageLoader.createCube = function(left, right, top, temp, hasNoShadow, height){
    var createCubeLeft = function(src){
        src = android.graphics.Bitmap.createBitmap(src, 0, bs(32-height), bs(32), bs(height));
        src = android.graphics.Bitmap.createScaledBitmap(src, bs(25), bs(height), false);
        var mSrc = [0, 0, bs(25), 0, bs(25), bs(height), 0, bs(height)];
        var mDst = [0, 0, bs(25), bs(12), bs(25), bs(12+height), 0, bs(height)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(mSrc, 0, mDst, 0, 4);
        return android.graphics.Bitmap.createBitmap(src, 0, 0, src.getWidth(), src.getHeight(), BlockImageLoader.MTRX, false);
    };
    var createCubeRight = function(src){
        src = android.graphics.Bitmap.createBitmap(src, 0, bs(32-height), bs(32), bs(height));
        src = android.graphics.Bitmap.createScaledBitmap(src, bs(26), bs(height), false);
        var mSrc = [0, 0, bs(26), 0, bs(26), bs(height), 0, bs(height)];
        var mDst = [0, bs(12), bs(26), 0, bs(26), bs(height), 0, bs(12+height)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(mSrc, 0, mDst, 0, 4);
        return android.graphics.Bitmap.createBitmap(src, 0, 0, src.getWidth(), src.getHeight(), BlockImageLoader.MTRX, false);
    };
    var createCubeTop = function(src){
        var mSrc = [0, 0, bs(32), 0, bs(32), bs(32), 0, bs(32)];
        var mDst = [0, bs(13.5), bs(25), 0, bs(51), bs(13.5), bs(25), bs(26)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(mSrc, 0, mDst, 0, 4);
        return android.graphics.Bitmap.createBitmap(src, 0, 0, src.getWidth(), src.getHeight(), BlockImageLoader.MTRX, false);
    };
    left = createCubeLeft(left);
    right = createCubeRight(right);
    top = createCubeTop(top);
    BlockImageLoader.CANVAS.setBitmap(temp);
    var p = new android.graphics.Paint();
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(left, 0, temp.getHeight()-left.getHeight(), p);
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(right, bs(25), temp.getHeight()-right.getHeight(), p);
    BlockImageLoader.CANVAS.drawBitmap(top, 0, bs(32-height), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
BlockImageLoader.createStair = function(left, right, top, temp, hasNoShadow){
    var createLeft = function(left){
        left = android.graphics.Bitmap.createScaledBitmap(left, bs(25), bs(32), false);
        var src = [0, 0, bs(25), 0, bs(25), bs(32), 0, bs(32)];
        var dst = [0, 0, bs(25), bs(12), bs(25), bs(44), 0, bs(32)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        return android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
    };
    var createRight = function(right){
        right = android.graphics.Bitmap.createScaledBitmap(right, bs(26), bs(32), false);
        var first = android.graphics.Bitmap.createBitmap(right, 0, 0, bs(26), bs(16));
        var src = [0, 0, bs(26), 0, bs(26), bs(16), 0, bs(16)];
        var dst = [0, bs(13), bs(26), 0, bs(26), bs(16), 0, bs(29)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        first = android.graphics.Bitmap.createBitmap(first, 0, 0, first.getWidth(), first.getHeight(), BlockImageLoader.MTRX, false);
        var second = android.graphics.Bitmap.createBitmap(right, 0, bs(16), bs(26), bs(16));
        second = android.graphics.Bitmap.createBitmap(second, 0, 0, second.getWidth(), second.getHeight(), BlockImageLoader.MTRX, false);
        return [first, second];
    };
    var createTop = function(top) {
        top = android.graphics.Bitmap.createScaledBitmap(top, bs(32), bs(32), false);
        var first = android.graphics.Bitmap.createBitmap(top, 0, 0, bs(32), bs(16));
        var src = [0, 0, bs(32), 0, bs(32), bs(16), 0, bs(16)];
        var dst = [0, bs(13.5), bs(26), 0, bs(38.25), bs(6.5), bs(12.75), bs(19.5)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        first = android.graphics.Bitmap.createBitmap(first, 0, 0, first.getWidth(), first.getHeight(), BlockImageLoader.MTRX, false);
        var second = android.graphics.Bitmap.createBitmap(top, 0, bs(16), bs(32), bs(16));
        second = android.graphics.Bitmap.createBitmap(second, 0, 0, second.getWidth(), second.getHeight(), BlockImageLoader.MTRX, false);
        return [first, second];
    };
    left = createLeft(left);
    right = createRight(right);
    top = createTop(top);
    BlockImageLoader.CANVAS.setBitmap(temp);
    var p = new android.graphics.Paint();
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(left, 0, temp.getHeight()-left.getHeight(), p);
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(right[0], bs(13), bs(6), p);
    BlockImageLoader.CANVAS.drawBitmap(right[1], bs(25), temp.getHeight()-right[1].getHeight(), p);
    BlockImageLoader.CANVAS.drawBitmap(top[0], 0, 0, null);
    BlockImageLoader.CANVAS.drawBitmap(top[1], bs(13), bs(22), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
BlockImageLoader.createFence = function(left, right, top, temp, hasNoShadow){
    var createVert = function(left, right, top){
        left = android.graphics.Bitmap.createBitmap(left, bs(12), 0, bs(8), bs(32));
        left = android.graphics.Bitmap.createScaledBitmap(left, bs(6), bs(32), false);
        var src = [0, 0, bs(6), 0, bs(6), bs(32), 0, bs(32)];
        var dst = [0, 0, bs(6), bs(3), bs(6), bs(35), 0, bs(32)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        right = android.graphics.Bitmap.createBitmap(right, bs(12), 0, bs(8), bs(32));
        right = android.graphics.Bitmap.createScaledBitmap(right, bs(6), bs(32), false);
        src = [0, 0, bs(6), 0, bs(6), bs(32), 0, bs(32)];
        dst = [0, bs(3), bs(6), 0, bs(6), bs(32), 0, bs(35)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        top = android.graphics.Bitmap.createBitmap(top, bs(12), bs(12), bs(8), bs(8));
        top = android.graphics.Bitmap.createScaledBitmap(top, bs(6), bs(6), false);
        src = [0, 0, bs(6), 0, bs(6), bs(6), 0, bs(5)];
        dst = [0, bs(3), bs(6.5), 0, bs(12), bs(3), bs(3), bs(6.5)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        var temp = android.graphics.Bitmap.createBitmap(bs(12), bs(38), android.graphics.Bitmap.Config.ARGB_8888);
        BlockImageLoader.CANVAS.setBitmap(temp);
        var p = android.graphics.Paint();
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(left, 0, bs(3), p);
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(right, bs(6), bs(3), p);
        BlockImageLoader.CANVAS.drawBitmap(top, 0, 0, null);
        return temp;
    };
    var createHorz = function(left, right, top, type){
        left = android.graphics.Bitmap.createBitmap(left, 0, bs(2+type*16), bs(32), bs(4));
        var src = [0, 0, bs(32), 0, bs(32), bs(4), 0, bs(4)];
        var dst = [0, 0, bs(32), bs(16), bs(32), bs(20), 0, bs(4)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        right = android.graphics.Bitmap.createBitmap(right, bs(15), bs(2+type*16), bs(3), bs(4));
        src = [0, 0, bs(3), 0, bs(3), bs(4), 0, bs(4)];
        dst = [0, bs(2), bs(3), 0, bs(3), bs(4), 0, bs(6)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        top = android.graphics.Bitmap.createBitmap(top, bs(15), 0, bs(2), bs(32));
        top = android.graphics.Bitmap.createScaledBitmap(top, bs(2), bs(35), false);
        src = [0, 0, bs(2), 0, bs(2), bs(35), 0, bs(35)];
        dst = [0, bs(2), bs(5), 0, bs(35), bs(15), bs(32), bs(17)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        var temp = android.graphics.Bitmap.createBitmap(bs(35), bs(22), android.graphics.Bitmap.Config.ARGB_8888);
        BlockImageLoader.CANVAS.setBitmap(temp);
        var p = android.graphics.Paint();
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(left, 0, bs(2), p);
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(right, bs(32), bs(16), p);
        BlockImageLoader.CANVAS.drawBitmap(top, 0, bs(1), null);
        return temp;
    };
    var vert = createVert(left, right, top);
    var horz1 = createHorz(left, right, top, 0);
    var horz2 = createHorz(left, right, top, 1);
    BlockImageLoader.CANVAS.setBitmap(temp);
    BlockImageLoader.CANVAS.drawBitmap(vert, bs(10), bs(5), null);
    BlockImageLoader.CANVAS.drawBitmap(vert, temp.getWidth()-vert.getWidth()-bs(10), temp.getHeight()-vert.getHeight()-bs(5), null);
    BlockImageLoader.CANVAS.drawBitmap(horz1, bs(8), bs(6), null);
    BlockImageLoader.CANVAS.drawBitmap(horz2, bs(8), bs(21), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
BlockImageLoader.createWall = function(left, right, top, temp, hasNoShadow) {
    var createVert = function(left, right, top) {
        left = android.graphics.Bitmap.createBitmap(left, bs(8), 0, bs(16), bs(32));
        left = android.graphics.Bitmap.createScaledBitmap(left, bs(13), bs(32), false);
        var src = [0, 0, bs(13), 0, bs(13), bs(32), 0, bs(32)];
        var dst = [0, 0, bs(13), bs(6), bs(13), bs(38), 0, bs(32)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        right = android.graphics.Bitmap.createScaledBitmap(right, bs(13), bs(32), false);
        src = [0, 0, bs(13), 0, bs(13), bs(32), 0, bs(32)];
        dst = [0, bs(6), bs(13), 0, bs(13), bs(32), 0, bs(38)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        top = android.graphics.Bitmap.createBitmap(top, bs(8), bs(8), bs(16), bs(16));
        top = android.graphics.Bitmap.createScaledBitmap(top, bs(13), bs(13), false);
        src = [0, 0, bs(13), 0, bs(13), bs(13), 0, bs(13)];
        dst = [0, bs(6.5), bs(13.5), 0, bs(26), bs(6.5), bs(13.5), bs(13)];
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        var temp = android.graphics.Bitmap.createBitmap(bs(26), bs(44), android.graphics.Bitmap.Config.ARGB_8888);
        BlockImageLoader.CANVAS.setBitmap(temp);
        var p = new android.graphics.Paint();
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(left, 0, bs(6), p);
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(right, bs(13), bs(6), p);
        BlockImageLoader.CANVAS.drawBitmap(top, 0, 0, null);
        return temp;
    };
    var createHorzRight = function(right){
        right = android.graphics.Bitmap.createBitmap(right, bs(8), bs(8), bs(16), bs(24));
        right = android.graphics.Bitmap.createScaledBitmap(right, bs(11), bs(24), false);
        var src = [0, 0, bs(11), 0, bs(11), bs(24), 0, bs(24)];
        var dst = [0, bs(6), bs(11), 0, bs(11), bs(24), 0, bs(30)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        return right;
    };
    var createHorzTop = function(top){
        top = android.graphics.Bitmap.createBitmap(top, bs(8), 0, bs(16), bs(32));
        var src = [0, bs(32), 0, 0, bs(16), 0, bs(16), bs(32)];
        var dst = [0, bs(6.5), bs(11), 0, bs(21), bs(5), bs(10), bs(11.5)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        return top;
    };
    var vert = createVert(left, right, top);
    var rightHorz = createHorzRight(right);
    var topHorz = createHorzTop(top);
    BlockImageLoader.CANVAS.setBitmap(temp);
    var p = new android.graphics.Paint();
    BlockImageLoader.CANVAS.drawBitmap(vert, temp.getWidth()-vert.getWidth(), 0, null);
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(rightHorz, bs(26), bs(18), p);
    BlockImageLoader.CANVAS.drawBitmap(topHorz, bs(16), bs(13), null);
    BlockImageLoader.CANVAS.drawBitmap(vert, 0, temp.getHeight()-vert.getHeight(), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
BlockImageLoader.createButton = function(left, right, top, temp, hasNoShadow){
    var createLeft = function(left) {
        left = android.graphics.Bitmap.createBitmap(left, bs(10), bs(12), bs(12), bs(8));
        left = android.graphics.Bitmap.createScaledBitmap(left, bs(9), bs(8), false);
        var src = [0, 0, bs(9), 0, bs(9), bs(8), 0, bs(9)];
        var dst = [0, 0, bs(9), bs(5), bs(9), bs(13), 0, bs(9)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        return left;
    };
    var createRight = function(right) {
        right = android.graphics.Bitmap.createBitmap(right, bs(30), bs(12), bs(2), bs(8));
        right = android.graphics.Bitmap.createScaledBitmap(right, bs(4), bs(8), false);
        var src = [0, 0, bs(4), 0, bs(4), bs(8), 0, bs(8)];
        var dst = [0, bs(2), bs(4), 0, bs(4), bs(8), 0, bs(10)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        return right;
    };
    var createTop = function(top) {
        top = android.graphics.Bitmap.createBitmap(top, bs(10), 0, bs(12), bs(4));
        var src = [0, 0, bs(12), 0, bs(12), bs(4), 0, bs(4)];
        var dst = [bs(3), 0, bs(13), bs(5), bs(9), bs(7), 0, bs(2)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        return top;
    };
    left = createLeft(left);
    right = createRight(right);
    top = createTop(top);
    BlockImageLoader.CANVAS.setBitmap(temp);
    var p = new android.graphics.Paint();
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(left, bs(5), (temp.getHeight()-left.getHeight())/2+bs(4), p);
    if(hasNoShadow != false)
        p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
    BlockImageLoader.CANVAS.drawBitmap(right, bs(14), (temp.getHeight()-left.getHeight())/2+bs(8), p);
    BlockImageLoader.CANVAS.drawBitmap(top, bs(5), (temp.getHeight()-left.getHeight())/2+bs(2), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
BlockImageLoader.createFenceGate = function(left, right, top, temp, hasNoShadow){
    var createVert = function(left, right, top, type) {
        left = android.graphics.Bitmap.createBitmap(left, bs(type*28), 0, bs(4), bs(22));
        var src = [0, 0, bs(4), 0, bs(4), bs(22), 0, bs(22)];
        var dst = [0, 0, bs(4), bs(3), bs(4), bs(25), 0, bs(22)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        right = android.graphics.Bitmap.createBitmap(right, bs(14), 0, bs(4), bs(22));
        var src = [0, 0, bs(4), 0, bs(4), bs(22), 0, bs(22)];
        var dst = [0, 3, bs(4), 0, bs(4), bs(22), 0, bs(25)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        top = android.graphics.Bitmap.createBitmap(top, bs(type*28), bs(14), bs(4), bs(4));
        var src = [0, 0, bs(4), 0, bs(4), bs(4), 0, bs(4)];
        var dst = [0, bs(3), bs(4), 0, bs(8), bs(3), bs(4), bs(6)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        var temp = android.graphics.Bitmap.createBitmap(bs(8), bs(28), android.graphics.Bitmap.Config.ARGB_8888);
        BlockImageLoader.CANVAS.setBitmap(temp);
        var p = new android.graphics.Paint();
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(left, 0, bs(3), p);
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(right, bs(4), bs(3), p);
        BlockImageLoader.CANVAS.drawBitmap(top, 0, 0, null);
        return temp;
    };
    var createHoriz = function(left, right, top) {
        left = android.graphics.Bitmap.createBitmap(left, 0, bs(2), bs(32), bs(14));
        var src = [0, 0, bs(32), 0, bs(32), bs(14), 0, bs(14)];
        var dst = [0, 0, bs(26), bs(13), bs(26), bs(27), 0, bs(14)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        left = android.graphics.Bitmap.createBitmap(left, 0, 0, left.getWidth(), left.getHeight(), BlockImageLoader.MTRX, false);
        right = android.graphics.Bitmap.createBitmap(right, bs(14), 0, bs(4), bs(14));
        var src = [0, 0, bs(4), 0, bs(4), bs(14), 0, bs(14)];
        var dst = [bs(3), 0, bs(4), 0, bs(4), bs(14), 0, bs(17)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        right = android.graphics.Bitmap.createBitmap(right, 0, 0, right.getWidth(), right.getHeight(), BlockImageLoader.MTRX, false);
        top = android.graphics.Bitmap.createBitmap(top, bs(14), 0, bs(4), bs(32));
        var src = [0, 0, bs(4), 0, bs(4), bs(32), 0, bs(32)];
        var dst = [0, bs(3), bs(4), 0, bs(30), bs(13), bs(26), bs(16)];
        BlockImageLoader.MTRX.reset();
        BlockImageLoader.MTRX.setPolyToPoly(src, 0, dst, 0, 4);
        top = android.graphics.Bitmap.createBitmap(top, 0, 0, top.getWidth(), top.getHeight(), BlockImageLoader.MTRX, false);
        var temp = android.graphics.Bitmap.createBitmap(bs(30), bs(30), android.graphics.Bitmap.Config.ARGB_8888);
        BlockImageLoader.CANVAS.setBitmap(temp);
        var p = new android.graphics.Paint();
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-65, 255-65, 255-65), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(left, 0, bs(3), p);
        if(hasNoShadow != false)
            p.setColorFilter(new android.graphics.PorterDuffColorFilter(android.graphics.Color.rgb(255-130, 255-130, 255-130), android.graphics.PorterDuff.Mode.MULTIPLY));
        BlockImageLoader.CANVAS.drawBitmap(right, bs(26), bs(16), p);
        BlockImageLoader.CANVAS.drawBitmap(top, 0, 0, null);
        return temp;
    };
    var vert1 = createVert(left, right, top, 0);
    var vert2 = createVert(left, right, top, 1);
    var horz = createHoriz(left, right, top);
    BlockImageLoader.CANVAS.setBitmap(temp);
    BlockImageLoader.CANVAS.drawBitmap(vert1, bs(13), bs(5), null);
    BlockImageLoader.CANVAS.drawBitmap(vert2, bs(35), bs(15), null);
    BlockImageLoader.CANVAS.drawBitmap(horz, bs(13), bs(8), null);
    return BitmapUtils.getScaled(temp,dp(14),dp(15));
};
var guiImageSize = () => BitmapUtils.getFromTexture("gui/gui.png").getWidth()/256;
var dp = (pixels) => android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_DIP,2,ctx.getResources().getDisplayMetrics())*pixels;
//eval("var Items = "+new java.lang.String(ModPE.getBytesFromTexturePack("assets/pocket_manager_resources.json"))+";");
BlockImageLoader.init();

///# Items Data #///
var Items = {
		"1":[{
				"icon":[["stone",0],["stone",0],["stone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",1],["stone",1],["stone",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",2],["stone",2],["stone",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",3],["stone",3],["stone",3]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",4],["stone",4],["stone",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",5],["stone",5],["stone",5]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stone",6],["stone",6],["stone",6]],
				"shape":BlockType.CUBE
		}],
		"2":[{
				"icon":[["grass",3],["grass",2],["grass",3]],
				"shape":BlockType.CUBE
		}],
		"3":[{
				"icon":[["dirt",0],["dirt",0],["dirt",0]],
				"shape":BlockType.CUBE
		}],
		"4":[{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.CUBE
		}],
		"5":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.CUBE
		}],
		"6":[{
				"icon":[["sapling",0],["sapling",0],["sapling",0]],
				"shape":BlockType.NONE,
		},{
				"icon":[["sapling",1],["sapling",1],["sapling",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["sapling",2],["sapling",2],["sapling",2]],
				"shape":BlockType.NONE
		},{
				"icon":[["sapling",3],["sapling",3],["sapling",3]],
				"shape":BlockType.NONE
		},{
				"icon":[["sapling",4],["sapling",4],["sapling",4]],
				"shape":BlockType.NONE
		},{
				"icon":[["sapling",5],["sapling",5],["sapling",5]],
				"shape":BlockType.NONE
		}],
		"7":[{
				"icon":[["bedrock",0],["bedrock",0],["bedrock",0]],
				"shape":BlockType.CUBE
		}],
		"8":[{
				"icon":[["flowing_water",0],["flowing_water",0],["flowing_water",0]],
				"shape":BlockType.NONE
		}],
		"9":[{
				"icon":[["still_water",0],["still_water",0],["still_water",0]],
				"shape":BlockType.NONE
		}],
		"10":[{
				"icon":[["flowing_lava",0],["flowing_lava",0],["flowing_lava",0]],
				"shape":BlockType.NONE,
		}],
		"11":[{
				"icon":[["still_lava",0],["still_lava",0],["still_lava",0]],
				"shape":BlockType.NONE
		}],
		"12":[{
				"icon":[["sand",0],["sand",0],["sand",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["sand",1],["sand",1],["sand",1]],
				"shape":BlockType.CUBE
		}],
		"13":[{
				"icon":[["gravel",0],["gravel",0],["gravel",0]],
				"shape":BlockType.CUBE,
		}],
		"14":[{
				"icon":[["gold_ore",0],["gold_ore",0],["gold_ore",0]],
				"shape":BlockType.CUBE
		}],
		"15":[{
				"icon":[["iron_ore",0],["iron_ore",0],["iron_ore",0]],
				"shape":BlockType.CUBE
		}],
		"16":[{
				"icon":[["coal_ore",0],["coal_ore",0],["coal_ore",0]],
				"shape":BlockType.CUBE
		}],
		"17":[{
				"icon":[["log",0],["log",1],["log",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["log",2],["log",3],["log",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["log",4],["log",5],["log",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["log",6],["log",7],["log",6]],
				"shape":BlockType.CUBE
		}],
		"18":[{
				"icon":[["leaves",4],["leaves",4],["leaves",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["leaves",5],["leaves",5],["leaves",5]],
				"shape":BlockType.CUBE
		},{
				"icon":[["leaves",6],["leaves",6],["leaves",6]],
				"shape":BlockType.CUBE
		},{
				"icon":[["leaves",7],["leaves",7],["leaves",7]],
				"shape":BlockType.CUBE
		}],
		"19":[{
				"icon":[["sponge",0],["sponge",0],["sponge",0]],
				"shape":BlockType.CUBE
		}],
		"20":[{
				"icon":[["glass",0],["glass",0],["glass",0]],
				"shape":BlockType.CUBE
		}],
		"21":[{
				"icon":[["lapis_ore",0],["lapis_ore",0],["lapis_ore",0]],
				"shape":BlockType.CUBE
		}],
		"22":[{
				"icon":[["lapis_block",0],["lapis_block",0],["lapis_block",0]],
				"shape":BlockType.CUBE
		}],
		"23":[{
				"icon":[["furnace",2],["furnace",3],["dispenser_front_horizontal",0]],
				"shape":BlockType.CUBE
		}],
		"24":[{
				"icon":[["sandstone",0],["sandstone",3],["sandstone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["sandstone",1],["sandstone",3],["sandstone",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["sandstone",2],["sandstone",3],["sandstone",2]],
				"shape":BlockType.CUBE
		}],
		"25":[{
				"icon":[["jukebox_side",0],["jukebox_side",0],["jukebox_side",0]],
				"shape":BlockType.CUBE
		}],
		"26":[{
				"icon":[["bed",1],["bed",1],["bed",1]],
				"shape":BlockType.NONE
		}],
		"27":[{
				"icon":[["rail_golden",0],["rail_golden",0],["rail_golden",0]],
				"shape":BlockType.NONE
		}],
		"28":[{
				"icon":[["rail_detector",0],["rail_detector",0],["rail_detector",0]],
				"shape":BlockType.NONE
		}],
		"30":[{
				"icon":[["web",0],["web",0],["web",0]],
				"shape":BlockType.NONE
		}],
		"31":[{
				"icon":[["tallgrass",3],["tallgrass",3],["tallgrass",3]],
				"shape":BlockType.NONE
		},{
				"icon":[["tallgrass",3],["tallgrass",3],["tallgrass",3]],
				"shape":BlockType.NONE
		},{
				"icon":[["tallgrass",4],["tallgrass",4],["tallgrass",4]],
				"shape":BlockType.NONE
		},{
				"icon":[["tallgrass",4],["tallgrass",4],["tallgrass",4]],
				"shape":BlockType.NONE
		}],
		"32":[{
				"icon":[["tallgrass",1],["tallgrass",1],["tallgrass",1]],
				"shape":BlockType.NONE
		}],
		"35":[{
				"icon":[["wool",0],["wool",0],["wool",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",1],["wool",1],["wool",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",2],["wool",2],["wool",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",3],["wool",3],["wool",3]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",4],["wool",4],["wool",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",5],["wool",5],["wool",5]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",6],["wool",6],["wool",6]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",7],["wool",7],["wool",7]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",8],["wool",8],["wool",8]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",9],["wool",9],["wool",9]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",10],["wool",10],["wool",10]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",11],["wool",11],["wool",11]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",12],["wool",12],["wool",12]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",13],["wool",13],["wool",13]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",14],["wool",14],["wool",14]],
				"shape":BlockType.CUBE
		},{
				"icon":[["wool",15],["wool",15],["wool",15]],
				"shape":BlockType.CUBE
		}],
		"37":[{
				"icon":[["flower1",0],["flower1",0],["flower1",0]],
				"shape":BlockType.NONE
		}],
		"38":[{
				"icon":[["flower2",0],["flower2",0],["flower2",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",1],["flower2",1],["flower2",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",2],["flower2",2],["flower2",2]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",3],["flower2",3],["flower2",3]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",4],["flower2",4],["flower2",4]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",5],["flower2",5],["flower2",5]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",6],["flower2",6],["flower2",6]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",7],["flower2",7],["flower2",7]],
				"shape":BlockType.NONE
		},{
				"icon":[["flower2",8],["flower2",8],["flower2",8]],
				"shape":BlockType.NONE
		}],
		"39":[{
				"icon":[["mushroom_brown",0],["mushroom_brown",0],["mushroom_brown",0]],
				"shape":BlockType.NONE
		}],
		"40":[{
				"icon":[["mushroom_red",0],["mushroom_red",0],["mushroom_red",0]],
				"shape":BlockType.NONE
		}],
		"41":[{
				"icon":[["gold_block",0],["gold_block",0],["gold_block",0]],
				"shape":BlockType.CUBE
		}],
		"42":[{
				"icon":[["iron_block",0],["iron_block",0],["iron_block",0]],
				"shape":BlockType.CUBE
		}],
		"43":[{
				"icon":[["stone_slab",1],["stone_slab",0],["stone_slab",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["sandstone",0],["sandstone",3],["sandstone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["brick",0],["brick",0],["brick",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",0],["stonebrick",0],["stonebrick",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["quartz_block",0],["quartz_block",0],["quartz_block",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["nether_brick",0],["nether_brick",0],["nether_brick",0]],
				"shape":BlockType.CUBE
		}],
		"44":[{
				"icon":[["stone_slab",1],["stone_slab",0],["stone_slab",1]],
				"shape":BlockType.SLAB
		},{
				"icon":[["sandstone",0],["sandstone",3],["sandstone",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["brick",0],["brick",0],["brick",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["stonebrick",0],["stonebrick",0],["stonebrick",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["quartz_block",0],["quartz_block",0],["quartz_block",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["nether_brick",0],["nether_brick",0],["nether_brick",0]],
				"shape":BlockType.SLAB
		}],
		"45":[{
				"icon":[["brick",0],["brick",0],["brick",0]],
				"shape":BlockType.CUBE
		}],
		"46":[{
				"icon":[["tnt",0],["tnt",1],["tnt",0]],
				"shape":BlockType.CUBE
		}],
		"47":[{
				"icon":[["bookshelf",0],["planks",0],["bookshelf",0]],
				"shape":BlockType.CUBE
		}],
		"48":[{
				"icon":[["cobblestone_mossy",0],["cobblestone_mossy",0],["cobblestone_mossy",0]],
				"shape":BlockType.CUBE
		}],
		"49":[{
				"icon":[["obsidian",0],["obsidian",0],["obsidian",0]],
				"shape":BlockType.CUBE
		}],
		"50":[{
				"icon":[["torch_on",0],["torch_on",0],["torch_on",0]],
				"shape":BlockType.NONE
		}],
		"51":[{
				"icon":[["fire",0],["fire",0],["fire",0]],
				"shape":BlockType.NONE
		}],
		"52":[{
				"icon":[["mob_spawner",0],["mob_spawner",0],["mob_spawner",0]],
				"shape":BlockType.CUBE
		}],
		"53":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.STAIR
		}],
		"54":[{
				"icon":[["chest_inventory",1],["chest_inventory",0],["chest_inventory",2]],
				"shape":BlockType.CUBE
		}],
		"55":[{
				"icon":[["redstone_dust_line",0],["redstone_dust_line",0],["redstone_dust_line",0]],
				"shape":BlockType.NONE
		}],
		"56":[{
				"icon":[["diamond_ore",0],["diamond_ore",0],["diamond_ore",0]],
				"shape":BlockType.CUBE
		}],
		"57":[{
				"icon":[["diamond_block",0],["diamond_block",0],["diamond_block",0]],
				"shape":BlockType.CUBE
		}],
		"58":[{
				"icon":[["crafting_table",1],["crafting_table",0],["crafting_table",2]],
				"shape":BlockType.CUBE
		}],
		"59":[{
				"icon":[["wheat",0],["wheat",0],["wheat",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",1],["wheat",1],["wheat",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",2],["wheat",2],["wheat",2]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",3],["wheat",3],["wheat",3]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",4],["wheat",4],["wheat",4]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",5],["wheat",5],["wheat",5]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",6],["wheat",6],["wheat",6]],
				"shape":BlockType.NONE
		},{
				"icon":[["wheat",7],["wheat",7],["wheat",7]],
				"shape":BlockType.NONE
		}],
		"60":[{
				"icon":[["dirt",0],["farmland",1],["dirt",0]],
				"shape":BlockType.CUBE
		}],
		"61":[{
				"icon":[["furnace",2],["furnace",3],["furnace",0]],
				"shape":BlockType.CUBE
		}],
		"62":[{
				"icon":[["furnace",2],["furnace",3],["furnace",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"63":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.NONE
		}],
		"64":[{
				"icon":[["door",0],["door",0],["door",0]],
				"shape":BlockType.NONE
		}],
		"65":[{
				"icon":[["ladder",0],["ladder",0],["ladder",0]],
				"shape":BlockType.NONE
		}],
		"66":[{
				"icon":[["rail_normal",0],["rail_normal",0],["rail_normal",0]],
				"shape":BlockType.NONE
		}],
		"67":[{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.STAIR
		}],
		"68":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.NONE
		}],
		"69":[{
				"icon":[["lever",0],["lever",0],["lever",0]],
				"shape":BlockType.NONE
		}],
		"70":[{
				"icon":[["stone",0],["stone",0],["stone",0]],
				"shape":BlockType.PLATE
		}],
		"71":[{
				"icon":[["door",12],["door",12],["door",12]],
				"shape":BlockType.NONE
		}],
		"72":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.PLATE
		}],
		"73":[{
				"icon":[["redstone_ore",0],["redstone_ore",0],["redstone_ore",0]],
				"shape":BlockType.CUBE
		}],
		"74":[{
				"icon":[["redstone_ore",0],["redstone_ore",0],["redstone_ore",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"75":[{
				"icon":[["redstone_torch_off",0],["redstone_torch_off",0],["redstone_torch_off",0]],
				"shape":BlockType.NONE
		}],
		"76":[{
				"icon":[["redstone_torch_on",0],["redstone_torch_on",0],["redstone_torch_on",0]],
				"shape":BlockType.NONE
		}],
		"77":[{
				"icon":[["stone",0],["stone",0],["stone",0]],
				"shape":BlockType.BUTTON
		}],
		"78":[{
				"icon":[["snow",0],["snow",0],["snow",0]],
				"shape":BlockType.SNOW
		}],
		"79":[{
				"icon":[["ice",0],["ice",0],["ice",0]],
				"shape":BlockType.CUBE
		}],
		"80":[{
				"icon":[["snow",0],["snow",0],["snow",0]],
				"shape":BlockType.CUBE
		}],
		"81":[{
				"icon":[["cactus",1],["cactus",0],["cactus",1]],
				"shape":BlockType.CUBE
		}],
		"82":[{
				"icon":[["clay",0],["clay",0],["clay",0]],
				"shape":BlockType.CUBE
		}],
		"83":[{
				"icon":[["reeds",0],["reeds",0],["reeds",0]],
				"shape":BlockType.NONE
		}],
		"84":[{
				"icon":[["jukebox_side",0],["jukebox_top",0],["jukebox_side",0]],
				"shape":BlockType.CUBE
		}],
		"85":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.FENCE
		},{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.FENCE
		},{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.FENCE
		},{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.FENCE
		},{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.FENCE
		},{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.FENCE
		}],
		"86":[{
				"icon":[["pumpkin",1],["pumpkin",0],["pumpkin",2]],
				"shape":BlockType.CUBE
		}],
		"87":[{
				"icon":[["netherrack",0],["netherrack",0],["netherrack",0]],
				"shape":BlockType.CUBE
		}],
		"88":[{
				"icon":[["soul_sand",0],["soul_sand",0],["soul_sand",0]],
				"shape":BlockType.CUBE
		}],
		"89":[{
				"icon":[["glowstone",0],["glowstone",0],["glowstone",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"90":[{
				"icon":[["portal",0],["portal",0],["portal",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"91":[{
				"icon":[["pumpkin",1],["pumpkin",0],["pumpkin",3]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"92":[{
				"icon":[["cake_side",0],["cake_top",0],["cake_side",0]],
				"shape":BlockType.NONE
		}],
		"93":[{
				"icon":[["repeater_off",0],["repeater_off",0],["repeater_off",0]],
				"shape":BlockType.NONE
		}],
		"94":[{
				"icon":[["repeater_on",0],["repeater_on",0],["repeater_on",0]],
				"shape":BlockType.NONE
		}],
		"95":[{
				"icon":[["stone",0],["stone",0],["stone",0]],
				"shape":BlockType.NONE
		}],
		"96":[{
				"icon":[["trapdoor",0],["trapdoor",0],["trapdoor",0]],
				"shape":BlockType.TRAPDOOR
		}],
		"97":[{
				"icon":[["stone",0],["stone",0],["stone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",0],["stonebrick",0],["stonebrick",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",1],["stonebrick",1],["stonebrick",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",2],["stonebrick",2],["stonebrick",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",3],["stonebrick",3],["stonebrick",3]],
				"shape":BlockType.CUBE
		}],
		"98":[{
				"icon":[["stonebrick",0],["stonebrick",0],["stonebrick",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",1],["stonebrick",1],["stonebrick",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",2],["stonebrick",2],["stonebrick",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stonebrick",3],["stonebrick",3],["stonebrick",3]],
				"shape":BlockType.CUBE
		}],
		"99":[{
				"icon":[["mushroom_block",2],["mushroom_block",2],["mushroom_block",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["mushroom_block",0],["mushroom_block",0],["mushroom_block",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["mushroom_block",3],["mushroom_block",3],["mushroom_block",3]],
				"shape":BlockType.CUBE
		}],
		"100":[{
				"icon":[["mushroom_block",2],["mushroom_block",2],["mushroom_block",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["mushroom_block",1],["mushroom_block",1],["mushroom_block",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["mushroom_block",3],["mushroom_block",3],["mushroom_block",3]],
				"shape":BlockType.CUBE
		}],
		"101":[{
				"icon":[["iron_bars",0],["iron_bars",0],["iron_bars",0]],
				"shape":BlockType.NONE
		}],
		"102":[{
				"icon":[["glass",0],["glass",0],["glass",0]],
				"shape":BlockType.NONE
		}],
		"103":[{
				"icon":[["melon",0],["melon",1],["melon",0]],
				"shape":BlockType.CUBE
		}],
		"104":[{
				"icon":[["pumpkin_stem",0],["pumpkin_stem",0],["pumpkin_stem",0]],
				"shape":BlockType.NONE
		}],
		"105":[{
				"icon":[["melon_stem",0],["melon_stem",0],["melon_stem",0]],
				"shape":BlockType.NONE
		}],
		"106":[{
				"icon":[["vine",1],["vine",1],["vine",1]],
				"shape":BlockType.NONE
		}],
		"107":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.FENCEGATE
		}],
		"108":[{
				"icon":[["brick",0],["brick",0],["brick",0]],
				"shape":BlockType.STAIR
		}],
		"109":[{
				"icon":[["stonebrick",0],["stonebrick",0],["stonebrick",0]],
				"shape":BlockType.STAIR
		}],
		"110":[{
				"icon":[["mycelium",0],["mycelium",1],["mycelium",0]],
				"shape":BlockType.CUBE
		}],
		"111":[{
				"icon":[["waterlily",1],["waterlily",1],["waterlily",1]],
				"shape":BlockType.NONE
		}],
		"112":[{
				"icon":[["nether_brick",0],["nether_brick",0],["nether_brick",0]],
				"shape":BlockType.CUBE
		}],
		"113":[{
				"icon":[["nether_brick",0],["nether_brick",0],["nether_brick",0]],
				"shape":BlockType.FENCE
		}],
		"114":[{
				"icon":[["nether_brick",0],["nether_brick",0],["nether_brick",0]],
				"shape":BlockType.STAIR
		}],
		"115":[{
				"icon":[["nether_wart",0],["nether_wart",0],["nether_wart",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["nether_wart",1],["nether_wart",1],["nether_wart",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["nether_wart",2],["nether_wart",2],["nether_wart",2]],
				"shape":BlockType.NONE
		}],
		"116":[{
				"icon":[["enchanting_table_side",0],["enchanting_table_top",0],["enchanting_table_side",0]],
				"shape":BlockType.ENCHANT_TABLE
		}],
		"117":[{
				"icon":[["brewing_stand",0],["brewing_stand",0],["brewing_stand",0]],
				"shape":BlockType.NONE
		}],
		"118":[{
				"icon":[["cauldron_side",0],["cauldron_top",0],["cauldron_side",0]],
				"shape":BlockType.CUBE
		}],
		"120":[{
				"icon":[["endframee",1],["endframee",2],["endframee",1]],
				"shape":BlockType.ENDPORTAL
		}],
		"121":[{
				"icon":[["end_stone",0],["end_stone",0],["end_stone",0]],
				"shape":BlockType.CUBE
		}],
		"123":[{
				"icon":[["redstone_lamp_off",0],["redstone_lamp_off",0],["redstone_lamp_off",0]],
				"shape":BlockType.CUBE
		}],
		"124":[{
				"icon":[["redstone_lamp_on",0],["redstone_lamp_on",0],["redstone_lamp_on",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"125":[{
				"icon":[["furnace",2],["furnace",3],["dropper_front_horizontal",0]],
				"shape":BlockType.CUBE
		}],
		"126":[{
				"icon":[["rail_activator",0],["rail_activator",0],["rail_activator",0]],
				"shape":BlockType.NONE
		}],
		"127":[{
				"icon":[["cocoa",2],["cocoa",2],["cocoa",2]],
				"shape":BlockType.NONE
		}],
		"128":[{
				"icon":[["sandstone",0],["sandstone",3],["sandstone",0]],
				"shape":BlockType.STAIR
		}],
		"129":[{
				"icon":[["emerald_ore",0],["emerald_ore",0],["emerald_ore",0]],
				"shape":BlockType.CUBE
		}],
		"131":[{
				"icon":[["trip_wire_source",0],["trip_wire_source",0],["trip_wire_source",0]],
				"shape":BlockType.NONE
		}],
		"132":[{
				"icon":[["trip_wire",0],["trip_wire",0],["trip_wire",0]],
				"shape":BlockType.NONE
		}],
		"133":[{
				"icon":[["emerald_block",0],["emerald_block",0],["emerald_block",0]],
				"shape":BlockType.CUBE
		}],
		"134":[{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.STAIR
		}],
		"135":[{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.STAIR
		}],
		"136":[{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.STAIR
		}],
		"139":[{
				"icon":[["cobblestone",0],["cobblestone",0],["cobblestone",0]],
				"shape":BlockType.STONEWALL
		},{
				"icon":[["cobblestone_mossy",0],["cobblestone_mossy",0],["cobblestone_mossy",0]],
				"shape":BlockType.STONEWALL
		}],
		"140":[{
				"icon":[["flower_pot",0],["flower_pot",0],["flower_pot",0]],
				"shape":BlockType.NONE
		}],
		"141":[{
				"icon":[["carrots",0],["carrots",0],["carrots",0]],
				"shape":BlockType.NONE
		}],
		"142":[{
				"icon":[["potatoes",0],["potatoes",0],["potatoes",0]],
				"shape":BlockType.NONE
		}],
		"143":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.BUTTON
		}],
		"144":[{
				"icon":[["soul_sand",0],["soul_sand",0],["soul_sand",0]],
				"shape":BlockType.NONE
		}],
		"145":[{
				"icon":[["anvil_top_damaged_x",0],["anvil_top_damaged_x",0],["anvil_top_damaged_x",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["anvil_top_damaged_x",1],["anvil_top_damaged_x",1],["anvil_top_damaged_x",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["anvil_top_damaged_x",2],["anvil_top_damaged_x",2],["anvil_top_damaged_x",2]],
				"shape":BlockType.NONE
		}],
		"146":[{
				"icon":[["chest_inventory",1],["chest_inventory",0],["chest_inventory",2]],
				"shape":BlockType.CUBE
		}],
		"147":[{
				"icon":[["gold_block",0],["gold_block",0],["gold_block",0]],
				"shape":BlockType.PLATE
		}],
		"148":[{
				"icon":[["iron_block",0],["iron_block",0],["iron_block",0]],
				"shape":BlockType.PLATE
		}],
		"149":[{
				"icon":[["comparator_off",0],["comparator_off",0],["comparator_off",0]],
				"shape":BlockType.NONE
		}],
		"150":[{
				"icon":[["comparator_on",0],["comparator_on",0],["comparator_on",0]],
				"shape":BlockType.NONE
		}],
		"151":[{
				"icon":[["daylight_detector_side",0],["daylight_detector_top",0],["daylight_detector_side",0]],
				"shape":BlockType.DAYLIGHTSENSOR
		}],
		"152":[{
				"icon":[["redstone_block",0],["redstone_block",0],["redstone_block",0]],
				"shape":BlockType.CUBE
		}],
		"153":[{
				"icon":[["quartz_ore",0],["quartz_ore",0],["quartz_ore",0]],
				"shape":BlockType.CUBE
		}],
		"154":[{
				"icon":[["hopper_inside",0],["hopper_inside",0],["hopper_inside",0]],
				"shape":BlockType.NONE
		}],
		"155":[{
				"icon":[["quartz_block",1],["quartz_block",1],["quartz_block",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["quartz_block",5],["quartz_block",6],["quartz_block",5]],
				"shape":BlockType.CUBE
		},{
				"icon":[["quartz_block",3],["quartz_block",4],["quartz_block",3]],
				"shape":BlockType.CUBE
		}],
		"156":[{
				"icon":[["quartz_block",2],["quartz_block",2],["quartz_block",2]],
				"shape":BlockType.STAIR
		}],
		"157":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.CUBE
		}],
		"158":[{
				"icon":[["planks",0],["planks",0],["planks",0]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.SLAB
		},{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.SLAB
		}],
		"159":[{
				"icon":[["stained_clay",0],["stained_clay",0],["stained_clay",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",1],["stained_clay",1],["stained_clay",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",2],["stained_clay",2],["stained_clay",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",3],["stained_clay",3],["stained_clay",3]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",4],["stained_clay",4],["stained_clay",4]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",5],["stained_clay",5],["stained_clay",5]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",6],["stained_clay",6],["stained_clay",6]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",7],["stained_clay",7],["stained_clay",7]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",8],["stained_clay",8],["stained_clay",8]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",9],["stained_clay",9],["stained_clay",9]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",10],["stained_clay",10],["stained_clay",10]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",11],["stained_clay",11],["stained_clay",11]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",12],["stained_clay",12],["stained_clay",12]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",13],["stained_clay",13],["stained_clay",13]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",14],["stained_clay",14],["stained_clay",14]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",14],["stained_clay",14],["stained_clay",14]],
				"shape":BlockType.CUBE
		},{
				"icon":[["stained_clay",15],["stained_clay",15],["stained_clay",15]],
				"shape":BlockType.CUBE
		}],
		"161":[{
				"icon":[["leaves2",2],["leaves2",2],["leaves2",2]],
				"shape":BlockType.CUBE
		},{
				"icon":[["leaves2",3],["leaves2",3],["leaves2",3]],
				"shape":BlockType.CUBE
		}],
		"162":[{
				"icon":[["log2",0],["log2",1],["log2",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["log2",2],["log2",3],["log2",2]],
				"shape":BlockType.CUBE
		}],
		"163":[{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.STAIR
		}],
		"164":[{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.STAIR
		}],
		"165":[{
				"icon":[["slime_block",0],["slime_block",0],["slime_block",0]],
				"shape":BlockType.CUBE
		}],
		"167":[{
				"icon":[["iron_trapdoor",0],["iron_trapdoor",0],["iron_trapdoor",0]],
				"shape":BlockType.TRAPDOOR
		}],
		"170":[{
				"icon":[["hayblock",1],["hayblock",0],["hayblock",1]],
				"shape":BlockType.CUBE
		}],
		"171":[{
				"icon":[["wool",0],["wool",0],["wool",0]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",1],["wool",1],["wool",1]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",2],["wool",2],["wool",2]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",3],["wool",3],["wool",3]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",4],["wool",4],["wool",4]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",5],["wool",5],["wool",5]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",6],["wool",6],["wool",6]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",7],["wool",7],["wool",7]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",8],["wool",8],["wool",8]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",9],["wool",9],["wool",9]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",10],["wool",10],["wool",10]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",11],["wool",11],["wool",11]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",12],["wool",12],["wool",12]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",13],["wool",13],["wool",13]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",14],["wool",14],["wool",14]],
				"shape":BlockType.CARPET
		},{
				"icon":[["wool",15],["wool",15],["wool",15]],
				"shape":BlockType.CARPET
		}],
		"172":[{
				"icon":[["hardened_clay",0],["hardened_clay",0],["hardened_clay",0]],
				"shape":BlockType.CARPET
		}],
		"173":[{
				"icon":[["coal_block",0],["coal_block",0],["coal_block",0]],
				"shape":BlockType.CARPET
		}],
		"174":[{
				"icon":[["ice_packed",0],["ice_packed",0],["ice_packed",0]],
				"shape":BlockType.CARPET
		}],
		"175":[{
				"icon":[["sunflower_additional",0],["sunflower_additional",0],["sunflower_additional",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_top",1],["double_plant_top",1],["double_plant_top",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_carried",0],["double_plant_carried",0],["double_plant_carried",0]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_carried",1],["double_plant_carried",1],["double_plant_carried",1]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_top",4],["double_plant_top",4],["double_plant_top",4]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_top",5],["double_plant_top",5],["double_plant_top",5]],
				"shape":BlockType.NONE
		},{
				"icon":[["double_plant_top",0],["double_plant_top",0],["double_plant_top",0]],
				"shape":BlockType.NONE
		}],
		"178":[{
				"icon":[["daylight_detector_side",0],["daylight_detector_inverted_top",0],["daylight_detector_side",0]],
				"shape":BlockType.DAYLIGHTSENSOR
		}],
		"179":[{
				"icon":[["redsandstone",0],["redsandstone",3],["redsandstone",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["redsandstone",1],["redsandstone",3],["redsandstone",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["redsandstone",2],["redsandstone",3],["redsandstone",2]],
				"shape":BlockType.CUBE
		}],
		"180":[{
				"icon":[["redsandstone",0],["redsandstone",3],["redsandstone",0]],
				"shape":BlockType.STAIR
		}],
		"181":[{
				"icon":[["redsandstone",0],["redsandstone",3],["redsandstone",0]],
				"shape":BlockType.CUBE
		}],
		"182":[{
				"icon":[["redsandstone",0],["redsandstone",3],["redsandstone",0]],
				"shape":BlockType.SLAB
		}],
		"183":[{
				"icon":[["planks",1],["planks",1],["planks",1]],
				"shape":BlockType.FENCEGATE
		}],
		"184":[{
				"icon":[["planks",2],["planks",2],["planks",2]],
				"shape":BlockType.FENCEGATE
		}],
		"185":[{
				"icon":[["planks",3],["planks",3],["planks",3]],
				"shape":BlockType.FENCEGATE
		}],
		"186":[{
				"icon":[["planks",5],["planks",5],["planks",5]],
				"shape":BlockType.FENCEGATE
		}],
		"187":[{
				"icon":[["planks",4],["planks",4],["planks",4]],
				"shape":BlockType.FENCEGATE
		}],
		"193":[{
				"icon":[["door",2],["door",2],["door",2]],
				"shape":BlockType.NONE
		}],
		"194":[{
				"icon":[["door",4],["door",4],["door",4]],
				"shape":BlockType.NONE
		}],
		"195":[{
				"icon":[["door",6],["door",6],["door",6]],
				"shape":BlockType.NONE
		}],
		"196":[{
				"icon":[["door",8],["door",8],["door",8]],
				"shape":BlockType.NONE
		}],
		"197":[{
				"icon":[["door",10],["door",10],["door",10]],
				"shape":BlockType.NONE
		}],
		"198":[{
				"icon":[["grass_path",1],["grass_path",0],["grass_path",1]],
				"shape":BlockType.PATHGRASS
		}],
		"199":[{
				"icon":[["itemframe_background",0],["itemframe_background",0],["itemframe_background",0]],
				"shape":BlockType.NONE
		}],
		"243":[{
				"icon":[["dirt",2],["dirt",1],["dirt",2]],
				"shape":BlockType.CUBE
		}],
		"244":[{
				"icon":[["beetroot",0],["beetroot",0],["beetroot",0]],
				"shape":BlockType.NONE
		}],
		"245":[{
				"icon":[["stonecutter",1],["stonecutter",2],["stonecutter",0]],
				"shape":BlockType.CUBE
		}],
		"246":[{
				"icon":[["glowing_obsidian",0],["glowing_obsidian",0],["glowing_obsidian",0]],
				"shape":BlockType.CUBE,
				"light":true
		}],
		"247":[{
				"icon":[["reactor_core",0],["reactor_core",0],["reactor_core",0]],
				"shape":BlockType.CUBE
		},{
				"icon":[["reactor_core",1],["reactor_core",1],["reactor_core",1]],
				"shape":BlockType.CUBE
		},{
				"icon":[["reactor_core",2],["reactor_core",2],["reactor_core",2]],
				"shape":BlockType.CUBE
		}],
		"248":[{
				"icon":[["missing_tile",0],["missing_tile",0],["missing_tile",0]],
				"shape":BlockType.CUBE
		}],
		"249":[{
				"icon":[["missing_tile",0],["missing_tile",0],["missing_tile",0]],
				"shape":BlockType.CUBE
		}],
		"255":[{
				"icon":[["missing_tile",0],["missing_tile",0],["missing_tile",0]],
				"shape":BlockType.CUBE
		}],
		"256":[{
				"icon":["shovel",2]
		}],
		"257":[{
				"icon":["pickaxe",2]
		}],
		"258":[{
				"icon":["axe",2]
		}],
		"259":[{
				"icon":["flint_and_steel",0]
		}],
		"260":[{
				"icon":["apple",0]
		}],
		"261":[{
				"icon":["bow_standby",0]
		}],
		"262":[{
				"icon":["arrow",0]
		}],
		"263":[{
				"icon":["coal",0]
		},{
				"icon":["charcoal",0]
		}],
		"264":[{
				"icon":["diamond",0]
		}],
		"265":[{
				"icon":["iron_ingot",0]
		}],
		"266":[{
				"icon":["gold_ingot",0]
		}],
		"267":[{
				"icon":["sword",2]
		}],
		"268":[{
				"icon":["sword",0]
		}],
		"269":[{
				"icon":["shovel",0]
		}],
		"270":[{
				"icon":["pickaxe",0]
		}],
		"271":[{
				"icon":["axe",0]
		}],
		"272":[{
				"icon":["sword",1]
		}],
		"273":[{
				"icon":["shovel",1]
		}],
		"274":[{
				"icon":["pickaxe",1]
		}],
		"275":[{
				"icon":["axe",1]
		}],
		"276":[{
				"icon":["sword",4]
		}],
		"277":[{
				"icon":["shovel",4]
		}],
		"278":[{
				"icon":["pickaxe",4]
		}],
		"279":[{
				"icon":["axe",4]
		}],
		"280":[{
				"icon":["stick",0]
		}],
		"281":[{
				"icon":["bowl",0]
		}],
		"282":[{
				"icon":["mushroom_stew",0]
		}],
		"283":[{
				"icon":["sword",3]
		}],
		"284":[{
				"icon":["shovel",3]
		}],
		"285":[{
				"icon":["pickaxe",3]
		}],
		"286":[{
				"icon":["axe",3]
		}],
		"287":[{
				"icon":["string",0]
		}],
		"288":[{
				"icon":["feather",0]
		}],
		"289":[{
				"icon":["gunpowder",0]
		}],
		"290":[{
				"icon":["hoe",0]
		}],
		"291":[{
				"icon":["hoe",1]
		}],
		"292":[{
				"icon":["hoe",2]
		}],
		"293":[{
				"icon":["hoe",4]
		}],
		"294":[{
				"icon":["hoe",3]
		}],
		"295":[{
				"icon":["seeds_wheat",0]
		}],
		"296":[{
				"icon":["wheat",0]
		}],
		"297":[{
				"icon":["bread",0]
		}],
		"298":[{
				"icon":["helmet",0]
		}],
		"299":[{
				"icon":["chestplate",0]
		}],
		"300":[{
				"icon":["leggings",0]
		}],
		"301":[{
				"icon":["boots",0]
		}],
		"302":[{
				"icon":["helmet",1]
		}],
		"303":[{
				"icon":["chestplate",1]
		}],
		"304":[{
				"icon":["leggings",1]
		}],
		"305":[{
				"icon":["boots",1]
		}],
		"306":[{
				"icon":["helmet",2]
		}],
		"307":[{
				"icon":["chestplate",2]
		}],
		"308":[{
				"icon":["leggings",2]
		}],
		"309":[{
				"icon":["boots",2]
		}],
		"310":[{
				"icon":["helmet",4]
		}],
		"311":[{
				"icon":["chestplate",4]
		}],
		"312":[{
				"icon":["leggings",4]
		}],
		"313":[{
				"icon":["boots",4]
		}],
		"314":[{
				"icon":["helmet",3]
		}],
		"315":[{
				"icon":["chestplate",3]
		}],
		"316":[{
				"icon":["leggings",3]
		}],
		"317":[{
				"icon":["boots",3]
		}],
		"318":[{
				"icon":["flint",0]
		}],
		"319":[{
				"icon":["porkchop_raw",0]
		}],
		"320":[{
				"icon":["porkchop_cooked",0]
		}],
		"321":[{
				"icon":["painting",0]
		}],
		"322":[{
				"icon":["apple_golden",0]
		}],
		"323":[{
				"icon":["sign",0]
		}],
		"324":[{
				"icon":["door_wood",0]
		}],
		"325":[{
				"icon":["bucket",0]
		},{
				"icon":["bucket",1]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",2]
		},{
				"icon":["bucket",0]
		},{
				"icon":["bucket",3]
		}],
		"328":[{
				"icon":["minecart_normal",0]
		}],
		"329":[{
				"icon":["saddle",0]
		}],
		"330":[{
				"icon":["door_iron",0]
		}],
		"331":[{
				"icon":["redstone_dust",0]
		}],
		"332":[{
				"icon":["snowball",0]
		}],
		"333":[{
				"icon":["boat",0]
		}],
		"334":[{
				"icon":["leather",0]
		}],
		"336":[{
				"icon":["brick",0]
		}],
		"337":[{
				"icon":["clay_ball",0]
		}],
		"338":[{
				"icon":["reeds",0]
		}],
		"339":[{
				"icon":["paper",0]
		}],
		"340":[{
				"icon":["book_normal",0]
		}],
		"341":[{
				"icon":["slimeball",0]
		}],
		"342":[{
				"icon":["minecart_chest",0]
		}],
		"344":[{
				"icon":["egg",0]
		}],
		"345":[{
				"icon":["compass_item",0]
		}],
		"346":[{
				"icon":["fishing_rod",0]
		}],
		"347":[{
				"icon":["clock_item",0]
		}],
		"348":[{
				"icon":["glowstone_dust",0]
		}],
		"349":[{
				"icon":["fish_raw_cod",0]
		},{
				"icon":["fish_raw_salmon",0]
		},{
				"icon":["fish_raw_clown_fish",0]
		},{
				"icon":["fish_raw_puffer_fish",0]
		}],
		"350":[{
				"icon":["fish_cooked_cod",0]
		},{
				"icon":["fish_cooked_salmon",0]
		}],
		"351":[{
				"icon":["dye_powder",0]
		},{
				"icon":["dye_powder",1]
		},{
				"icon":["dye_powder",2]
		},{
				"icon":["dye_powder",3]
		},{
				"icon":["dye_powder",4]
		},{
				"icon":["dye_powder",5]
		},{
				"icon":["dye_powder",6]
		},{
				"icon":["dye_powder",7]
		},{
				"icon":["dye_powder",8]
		},{
				"icon":["dye_powder",9]
		},{
				"icon":["dye_powder",10]
		},{
				"icon":["dye_powder",11]
		},{
				"icon":["dye_powder",12]
		},{
				"icon":["dye_powder",13]
		},{
				"icon":["dye_powder",14]
		},{
				"icon":["dye_powder",15]
		}],
		"352":[{
				"icon":["bone",0]
		}],
		"353":[{
				"icon":["sugar",0]
		}],
		"354":[{
				"icon":["cake",0]
		}],
		"355":[{
				"icon":["bed",0]
		}],
		"356":[{
				"icon":["repeater",0]
		}],
		"357":[{
				"icon":["cookie",0]
		}],
		"358":[{
				"icon":["map_filled",0]
		}],
		"359":[{
				"icon":["shears",0]
		}],
		"360":[{
				"icon":["melon",0]
		}],
		"361":[{
				"icon":["seeds_pumpkin",0]
		}],
		"362":[{
				"icon":["seeds_melon",0]
		}],
		"363":[{
				"icon":["beef_raw",0]
		}],
		"364":[{
				"icon":["beef_cooked",0]
		}],
		"365":[{
				"icon":["chicken_raw",0]
		}],
		"366":[{
				"icon":["chicken_cooked",0]
		}],
		"367":[{
				"icon":["rotten_flesh",0]
		}],
		"369":[{
				"icon":["blaze_rod",0]
		}],
		"370":[{
				"icon":["ghast_tear",0]
		}],
		"371":[{
				"icon":["gold_nugget",0]
		}],
		"372":[{
				"icon":["nether_wart",0]
		}],
		"373":[{
				"icon":["potion_bottle_drinkable",0]
		}],
		"374":[{
				"icon":["potion_bottle_empty",0]
		}],
		"375":[{
				"icon":["spider_eye",0]
		}],
		"376":[{
				"icon":["spider_eye_fermented",0]
		}],
		"377":[{
				"icon":["blaze_powder",0]
		}],
		"378":[{
				"icon":["magma_cream",0]
		}],
		"379":[{
				"icon":["brewing_stand",0]
		}],
		"380":[{
				"icon":["cauldron",0]
		}],
		"382":[{
				"icon":["melon_speckled",0]
		}],
		"383":[{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",1]
		},{
				"icon":["spawn_egg",2]
		},{
				"icon":["spawn_egg",3]
		},{
				"icon":["spawn_egg",4]
		},{
				"icon":["spawn_egg",14]
		},{
				"icon":["spawn_egg",5]
		},{
				"icon":["spawn_egg",15]
		},{
				"icon":["spawn_egg",24]
		},{
				"icon":["spawn_egg",18]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",16]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",12]
		},{
				"icon":["spawn_egg",6]
		},{
				"icon":["spawn_egg",9]
		},{
				"icon":["spawn_egg",11]
		},{
				"icon":["spawn_egg",13]
		},{
				"icon":["spawn_egg",10]
		},{
				"icon":["spawn_egg",7]
		},{
				"icon":["spawn_egg",8]
		},{
				"icon":["spawn_egg",22]
		},{
				"icon":["spawn_egg",19]
		},{
				"icon":["spawn_egg",20]
		},{
				"icon":["spawn_egg",21]
		},{
				"icon":["spawn_egg",0]
		},{
				"icon":["spawn_egg",17]
		}],
		"384":[{
				"icon":["experience_bottle",0]
		}],
		"388":[{
				"icon":["emerald",0]
		}],
		"389":[{
				"icon":["item_frame",0]
		}],
		"390":[{
				"icon":["flower_pot",0]
		}],
		"391":[{
				"icon":["carrot",0]
		}],
		"392":[{
				"icon":["potato",0]
		}],
		"393":[{
				"icon":["potato_baked",0]
		}],
		"394":[{
				"icon":["potato_poisonous",0]
		}],
		"395":[{
				"icon":["map_empty",0]
		}],
		"396":[{
				"icon":["carrot_golden",0]
		}],
		"397":[{
				"icon":["skull_skeleton",0]
		}],
		"400":[{
				"icon":["pumpkin_pie",0]
		}],
		"403":[{
				"icon":["book_enchanted",0]
		}],
		"404":[{
				"icon":["comparator",0]
		}],
		"405":[{
				"icon":["netherbrick",0]
		}],
		"406":[{
				"icon":["quartz",0]
		}],
		"407":[{
				"icon":["minecart_tnt",0]
		}],
		"408":[{
				"icon":["minecart_hopper",0]
		}],
		"410":[{
				"icon":["hopper",0]
		}],
		"411":[{
				"icon":["rabbit",0]
		}],
		"412":[{
				"icon":["rabbit_cooked",0]
		}],
		"413":[{
				"icon":["rabbit_stew",0]
		}],
		"414":[{
				"icon":["rabbit_foot",0]
		}],
		"415":[{
				"icon":["rabbit_hide",0]
		}],
		"427":[{
				"icon":["door_spruce",0]
		}],
		"428":[{
				"icon":["door_birch",0]
		}],
		"429":[{
				"icon":["door_jungle",0]
		}],
		"430":[{
				"icon":["door_acacia",0]
		}],
		"431":[{
				"icon":["door_darkoak",0]
		}],
		"438":[{
				"icon":["potion_bottle_splash",0]
		}],
		"439":[{
				"icon":["camera",0]
		}],
		"457":[{
				"icon":["beetroot",0]
		}],
		"458":[{
				"icon":["seeds_beetroot",0]
		}],
		"459":[{
				"icon":["beetroot_soup",0]
		}],
		"460":[{
				"icon":["fish_raw_salmon",0]
		}],
		"461":[{
				"icon":["fish_raw_clown_fish",0]
		}],
		"462":[{
				"icon":["fish_raw_puffer_fish",0]
		}],
		"463":[{
				"icon":["fish_cooked_salmon",0]
		}],
		"466":[{
				"icon":["apple_golden",0]
		}]	
};
for(let i=0;i<=466;i++){
		if(Items[i]!==undefined){
				Items[i].forEach((element,index)=>{
						if(i<=255)
								Items[i][index].image = BlockImageLoader.create(Items[i][index].icon[0],Items[i][index].icon[1],Items[i][index].icon[2],Items[i][index].shape,Items[i][index].light===true?false:true);
						else 
								Items[i][index].image = Background.itemIcon(Items[i][index].icon[0],Items[i][index].icon[1]).getBitmap();
				});
		}
}
