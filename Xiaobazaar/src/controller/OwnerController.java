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
	
	public static JSONObject changeTheme(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Store store = StoreManager.getStoreById((long) inputJson.get("storeId"));
			
			store.setThemeId((long) inputJson.get("themeId"));
			
			StoreManager.modifyStore(store);
			
			returnJson.put("status", 1);
			returnJson.put("message", store.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject changePassword(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Owner owner = OwnerManager.getOwnerById((long) inputJson.get("ownerId"));
			String oldPassword = (String) inputJson.get("oldPassword");
			String newPassword = (String) inputJson.get("newPassword");
			
			if(owner.getPassword().equals(oldPassword)){
				owner.setPassword(newPassword);
				
				OwnerManager.modifyOwner(owner);
				
				returnJson.put("status", 1);
				returnJson.put("message", owner.toJson());
			}else{
				returnJson.put("status", 0);
				returnJson.put("message", "Old password is not correct!");
			}
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject updateOwner(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Owner owner = OwnerManager.getOwnerById((long) inputJson.get("ownerId"));
			String password = (String) inputJson.get("password");
			
			owner.setPassword(password);
			
			OwnerManager.modifyOwner(owner);
			
			returnJson.put("status", 1);
			returnJson.put("message", "success");
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject getStoreByUrl(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Store store = StoreManager.getStoreByURL((String) inputJson.get("url"));
			
			returnJson.put("status", 1);
			returnJson.put("message", store.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject editStore(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Store store = StoreManager.getStoreById((long) inputJson.get("storeId"));
			
			Store tryStore = StoreManager.getStoreByURL((String) inputJson.get("url"));
			
			if(tryStore == null){
				store.setName((String) inputJson.get("name"));
				store.setUrl((String) inputJson.get("url"));
				store.setLayout((long) inputJson.get("layout"));
				
				store.setDescription((String) inputJson.get("description"));
				
				StoreManager.modifyStore(store);
				
				returnJson.put("status", 1);
				returnJson.put("message", store.toJson());
			}else if(tryStore.getStoreId() == store.getStoreId()){
				store.setName((String) inputJson.get("name"));
				store.setUrl((String) inputJson.get("url"));
				store.setLayout((long) inputJson.get("layout"));
				
				store.setDescription((String) inputJson.get("description"));
				
				StoreManager.modifyStore(store);
				
				returnJson.put("status", 1);
				returnJson.put("message", store.toJson());
			}else{
				returnJson.put("status", 0);
				returnJson.put("message", "Url has been used!");
			}
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject createProduct(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Store store = StoreManager.getStoreById((long) inputJson.get("storeId"));
			
			String name = (String) inputJson.get("name");
			String url = (String) inputJson.get("imgUrl");
			String priceStr = (String) inputJson.get("price");
			String description = (String) inputJson.get("description");
			
			double price = Double.parseDouble(priceStr);
			
			Product product = new Product(store, name, url, price, description);
			
			ProductManager.addProduct(product);
			
			returnJson.put("status", 1);
			returnJson.put("message", product.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject editProduct(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Product product = ProductManager.getProductById((long) inputJson.get("productId"));
			
			String name = (String) inputJson.get("name");
			String url = (String) inputJson.get("imgUrl");
			String priceStr = (String) inputJson.get("price");
			String description = (String) inputJson.get("description");
			
			double price = Double.parseDouble(priceStr);
			
			product.setName(name);
			product.setImgUrl(url);
			product.setDescription(description);
			product.setPrice(price);
			
			ProductManager.modifyProduct(product);
			
			returnJson.put("status", 1);
			returnJson.put("message", product.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
	
	public static JSONObject deleteProduct(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Product product = ProductManager.getProductById((long) inputJson.get("productId"));
			
			ProductManager.deleteProduct(product);
			
			returnJson.put("status", 1);
			returnJson.put("message", "success");
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
			e.printStackTrace();
		}
		
		return returnJson;
	}
}
