package controller;

import manager.OwnerManager;
import manager.ProductManager;
import manager.StoreManager;
import model.Owner;
import model.Product;
import model.Store;

import org.json.simple.JSONObject;

public class OwnerController {
	public static JSONObject createOwner(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Owner existOwner = OwnerManager.getOwnerByName(name);
			if(existOwner == null){
				Owner owner = new Owner(name, password);
				OwnerManager.addOwner(owner);
				
				String description = "Where come to " + name+ "'s store, we provide wonderful products...";
				
				Store store = new Store(name+"'s store", owner, description);
				StoreManager.addStore(store);
				
				owner = OwnerManager.getOwnerByName(name);
				
				returnJson.put("status", 1);
				returnJson.put("message", owner.toJson());
			}else{
				returnJson.put("status", 0);
				returnJson.put("message", "The name has already exist!");
			}
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject ownerAuth(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Owner owner = OwnerManager.getOwnerByName(name);
			
			if(owner != null){
				if(owner.getPassword().equals(password)){
					returnJson.put("status", 1);
					returnJson.put("message", owner.toJson());
				}else{
					returnJson.put("status", 0);
					returnJson.put("message", "Password is not correct!");
				}
			}else{
				returnJson.put("status", 0);
				returnJson.put("message", "User name not exist!");
			}
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
}
