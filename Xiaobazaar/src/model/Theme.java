package model;

import org.json.simple.JSONObject;

public class Theme {

	private long themeId;
	private String name;
	private Designer designer;
	private String themeURL;
	private long themeStatus;
	
	public Theme(){}
	
	public Theme(String name, Designer designer, String themeURL, long themeStatus) {
		this.name = name;
		this.designer = designer;
		this.themeURL = themeURL;
		this.themeStatus = themeStatus;
	}
	
	public long isThemeStatus() {
		return themeStatus;
	}
	public void setThemeStatus(long themeStatus) {
		this.themeStatus = themeStatus;
	}
	public long getThemeId() {
		return themeId;
	}
	public void setThemeId(long themeId) {
		this.themeId = themeId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getThemeURL() {
		return themeURL;
	}
	public void setThemeURL(String themeURL) {
		this.themeURL = themeURL;
	}

	public Designer getDesigner() {
		return designer;
	}

	public void setDesigner(Designer designer) {
		this.designer = designer;
	}
	
	// method
	public JSONObject toJsonDesigner(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("themeId", this.themeId);
		returnJson.put("name", this.name);
		returnJson.put("designer", this.designer.getDesignerId());
		returnJson.put("themeURL", this.themeURL);

		return returnJson;
	}
	
	public JSONObject toJsonTheme(){
		JSONObject returnJson = new JSONObject();
		
		returnJson.put("themeId", this.themeId);
		returnJson.put("name", this.name);
		returnJson.put("designer", this.designer.toJson());
		returnJson.put("themeURL", this.themeURL);

		return returnJson;
	}
	

}
