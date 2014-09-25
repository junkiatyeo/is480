package model;

import java.util.Set;

import manager.ThemeManager;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Store {
	private long storeId;
	private String name;
	private Owner owner;
	private String description;
	private Set<Product> products;
	private long themeId;
	private String url;
	private long layout;
	
	public Store(){
		
	}
	
	public Store(String name, Owner owner, String description){
		this.name = name;
		this.owner = owner;
		this.description = description;
		this.themeId = 0;
		this.layout = 0;
		this.url = owner.getName();
	}
	
	// gets and sets
	public long getStoreId(){
		return this.storeId;
	}
	
	public void setStoreId(long storeId){
		this.storeId = storeId;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public Owner getOwner(){
		return this.owner;
	}
	
	public void setOwner(Owner owner){
		this.owner = owner;
	}
	
	public String getDescription(){
		return this.description;
	}
	
	public void setDescription(String description){
		this.description = description;
	}
	
	public Set<Product> getProducts(){
		return this.products;
	}
	
	public void setProducts(Set<Product> products){
		this.products = products;
	}
	
	public long getThemeId(){
		return this.themeId;
	}
	
	public void setThemeId(long themeId){
		this.themeId = themeId;
	}
	
	public String getUrl(){
		return this.url;
	}
	
	public void setUrl(String url){
		this.url = url;
	}
	
	public long getLayout(){
		return this.layout;
	}
	
	public void setLayout(long layout){
		this.layout = layout;
	}
	
	//method
	public JSONObject toJson(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("storeId", this.storeId);
		returnJson.put("owner", this.owner.getOwnerId());
		returnJson.put("description", this.description);
		returnJson.put("name", this.name);
		returnJson.put("themeId", this.themeId);
		
		if(this.themeId == 0){
			returnJson.put("themeName", "No theme");
		}else{
			try{
				Theme theme = ThemeManager.getThemeById(this.themeId);
				
				returnJson.put("themeName", theme.getName());
				returnJson.put("themeUrl", theme.getThemeURL());
			}catch(Exception e){
				returnJson.put("themeName", "No theme");
			}
		}
		
		returnJson.put("layout", this.layout);
		JSONArray productArr = new JSONArray();
		
		for(Product p: this.products){
			productArr.add(p.toJson());
		}
		
		returnJson.put("products", productArr);
		returnJson.put("url", this.url);
		
		return returnJson;
	}
	
}
