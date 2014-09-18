package model;

import org.json.simple.JSONObject;

public class Owner {
	private long ownerId;
	private String name;
	private String password;
	private Store store;
	
	public Owner(){
		
	}
	
	public Owner(String name, String password){
		this.name = name;
		this.password = password;
	}
	
	// sets and gets
	public long getOwnerId(){
		return this.ownerId;
	}
	
	public void setOwnerId(long ownerId){
		this.ownerId = ownerId;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getPassword(){
		return this.password;
	}
	
	public void setPassword(String password){
		this.password = password;
	}
	
	public Store getStore(){
		return this.store;
	}
	
	public void setStore(Store store){
		this.store = store;
	}
	
	//method
	public JSONObject toJson(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("ownerId", this.ownerId);
		returnJson.put("name", this.name);
		returnJson.put("store", this.store.toJson());
		
		return returnJson;
	}
	
}
