package controller;

import java.util.ArrayList;

import org.json.simple.*;
import model.Admin;
import manager.AdminManager;

public class AdminController {
	
	public JSONObject createAdmin(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Admin admin = new Admin(name, password);
			
			AdminManager.addAdmin(admin);
			
			returnJson.put("status", 1);
			returnJson.put("message", admin.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}
		
		return returnJson;
	}
	
	public JSONObject authAdmin(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		ArrayList<Admin> tem = new ArrayList<Admin>();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Admin admin = null;
			
			tem = AdminManager.getAllAdmins();
			
			for(Admin d : tem){
				if(d.getName().equals(name)){
					admin = d;
				}
			}
			
			if(admin ==null){
				returnJson.put("status", 0);
				returnJson.put("message","username does not exist");
			}else{
				if(admin.getPassword().equals(password)){
					returnJson.put("status", 1);
					returnJson.put("message",admin.toJson());
				}else{
					returnJson.put("status", 0);
					returnJson.put("message","password error");
				}
				
			}							
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}
		
		return returnJson;
	}
	
	public JSONObject updateAdmin(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Admin admin = AdminManager.getAdminById((long) inputJson.get("adminId"));
			String password = (String) inputJson.get("password");
			
			admin.setPassword(password);
			
			AdminManager.modifyAdmin(admin);
			
			returnJson.put("status", 1);
			returnJson.put("message", "success");
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}
		
		return returnJson;
	}
	
}
