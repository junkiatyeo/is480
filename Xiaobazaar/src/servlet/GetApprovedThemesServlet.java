package servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import manager.ThemeManager;
import model.Theme;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;


public class GetApprovedThemesServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetApprovedThemesServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		process(request, response);
	}

	protected void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		JSONObject returnJson = new JSONObject();
		try {
			List<Theme> a = ThemeManager.getApprovedThemes();
			JSONArray returnArray = new JSONArray();
			
			for(Theme t: a) {
				JSONObject o = new JSONObject();
				o.put("ThemeID", Long.toString(t.getThemeId()));
				o.put("Name",t.getName());
				o.put("Designer",t.getDesigner().getName());
				o.put("URL",t.getThemeURL());
				o.put("Status",Long.toString(t.isThemeStatus()));
				returnArray.add(o); 
			}
			returnJson.put("themes",returnArray);
			
			
		} catch (NullPointerException npe) {
			returnJson.put("status", 0);
			returnJson.put("message", npe.toString());
			npe.printStackTrace();
		}
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}
	
}
