package controller;

import java.util.ArrayList;

import org.json.simple.*;
import model.Designer;
import manager.DesignerManager;

public class DesignerController {
	
	public JSONObject createDesigner(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Designer designer = new Designer(name, password);
			
			DesignerManager.addDesigner(designer);
			
			returnJson.put("status", 1);
			returnJson.put("message", designer.toJson());
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}
		
		return returnJson;
	}
	
	public JSONObject authDesigner(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		ArrayList<Designer> tem = new ArrayList<Designer>();
		
		try{
			String name = (String) inputJson.get("name");
			String password = (String) inputJson.get("password");
			
			Designer designer = null;
			
			tem = DesignerManager.getAllDesigners();
			
			for(Designer d : tem){
				if(d.getName().equals(name)){
					designer = d;
				}
			}
			
			if(designer ==null){
				returnJson.put("status", 0);
				returnJson.put("message","username does not exist");
			}else{
				if(designer.getPassword().equals(password)){
					returnJson.put("status", 1);
					returnJson.put("message",designer.toJson());
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
	
	public JSONObject updateDesigner(JSONObject inputJson){
		JSONObject returnJson = new JSONObject();
		
		try{
			Designer designer = DesignerManager.getDesignerById((long) inputJson.get("designerId"));
			String password = (String) inputJson.get("password");
			
			designer.setPassword(password);
			
			DesignerManager.modifyDesigner(designer);
			
			returnJson.put("status", 1);
			returnJson.put("message", "success");
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", e.toString());
		}
		
		return returnJson;
	}
	
}
