package model;

import org.json.simple.JSONObject;

public class Product {
	private long productId;
	private Store store;
	private String name;
	private String imgUrl;
	private double price;
	private String description;
	private long displayOrder;
	
	public Product(){
		
	}
	
	public Product(Store store, String name, String imgUrl, double price, String description){
		this.store = store;
		this.name = name;
		this.imgUrl = imgUrl;
		this.price = price;
		this.description = description;
		this.displayOrder = 0;
	}
	
	//sets and gets
	public long getProductId(){
		return this.productId;
	}
	
	public void setProductId(long productId){
		this.productId = productId;
	}
	
	public Store getStore(){
		return this.store;
	}
	
	public void setStore(Store store){
		this.store = store;
	}
	
	public String getName(){
		return this.name;
	}
	
	public void setName(String name){
		this.name = name;
	}
	
	public String getImgUrl(){
		return this.imgUrl;
	}
	
	public void setImgUrl(String imgUrl){
		this.imgUrl = imgUrl;
	}
	
	public double getPrice(){
		return this.price;
	}
	
	public void setPrice(double price){
		this.price = price;
	}
	
	public String getDescription(){
		return this.description;
	}
	
	public void setDescription(String description){
		this.description = description;
	}
	
	public long getDisplayOrder(){
		return this.displayOrder;
	}
	
	public void setDisplayOrder(long displayOrder){
		this.displayOrder = displayOrder;
	}
	
	// method
	public JSONObject toJson(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("productId", this.productId);
		returnJson.put("store", this.store.getStoreId());
		returnJson.put("name", this.name);
		returnJson.put("imgUrl", this.imgUrl);
		returnJson.put("price", this.price);
		returnJson.put("description", this.description);
		returnJson.put("displayOrder", this.displayOrder);
		
		return returnJson;
	}
}
