package model;

import org.json.simple.JSONObject;

public class Admin {
	
	private long adminId;
	private String name;
	private String password;
	
	public Admin(){
		
	}
		
	public Admin(String name, String password) {
		super();
		this.name = name;
		this.password = password;
	}


	public long getAdminId() {
		return adminId;
	}


	public void setDesignerId(long adminId) {
		this.adminId = adminId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	//method
	public JSONObject toJson(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("designerId", this.adminId);
		returnJson.put("name", this.name);
		
		return returnJson;
	}

	
}
