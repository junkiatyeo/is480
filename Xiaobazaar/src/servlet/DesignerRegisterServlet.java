package servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import manager.DesignerManager;
import model.Designer;

import org.json.simple.JSONObject;
import org.json.simple.JSONValue;


public class DesignerRegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DesignerRegisterServlet() {
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
		String inputString = request.getParameter("json");
		//System.out.println(inputString);
		JSONObject inputJSON = (JSONObject)JSONValue.parse(inputString);
		String username = (String) inputJSON.get("name");
		String password = (String) inputJSON.get("password");
		//System.out.println(inputString);
		returnJson.put("status",0);
		try {
			Designer designer = new Designer(username, password);
			DesignerManager.addDesigner(designer);

			returnJson.put("status", 1);
			returnJson.put("message", username);
		} catch (NullPointerException npe) {
			returnJson.put("message", npe.toString());
			npe.printStackTrace();
		}
		
		response.setContentType("application/json");
		PrintWriter out = response.getWriter();
		out.print(returnJson.toString());
	}

}
