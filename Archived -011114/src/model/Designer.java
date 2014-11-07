package model;

import java.util.Set;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Designer {
	
	private long designerId;
	private String name;
	private String password;
	private Set<Theme>themes;
	
	public Designer(){
		
	}
		
	public Designer(String name, String password) {
		super();
		this.name = name;
		this.password = password;
	}


	public long getDesignerId() {
		return designerId;
	}


	public void setDesignerId(long designerId) {
		this.designerId = designerId;
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

	public Set<Theme> getThemes() {
		return themes;
	}

	public void setThemes(Set<Theme> themes) {
		this.themes = themes;
	}


	//method
	public JSONObject toJson(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("designerId", this.designerId);
		returnJson.put("name", this.name);
		JSONArray themeArray = new JSONArray();
		
		for(Theme t: this.themes){
			themeArray.add(t.toJsonDesigner());
		}
		
		returnJson.put("themes", themeArray);
		
		return returnJson;
	}

	
}
