package servlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItemIterator;
import org.apache.commons.fileupload.FileItemStream;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;

public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
    public FileUploadServlet() {
        super();
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);
	}
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		process(request, response);
	}
	
	protected void process(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		PrintWriter out = response.getWriter();
		JSONObject returnJson = new JSONObject();
		
		JSONParser parser = new JSONParser();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH_mm_ss");
		
		String contextRoot = getServletContext().getRealPath("/");
		response.setContentType("text/html;charset=UTF-8");
		
		try{
			JSONObject input = (JSONObject)parser.parse(request.getParameter("json"));
			//System.out.println("input: " + input.toJSONString());
			
			boolean isMultipart = ServletFileUpload.isMultipartContent(request);
			if(isMultipart){
				ServletFileUpload upload = new ServletFileUpload();
				
				try{
					FileItemIterator iter = upload.getItemIterator(request);
					while(iter.hasNext()){
						FileItemStream item = iter.next();
						try{
							String fieldName = item.getFieldName();
							if(fieldName.equals("file")){
								String dateString = sdf.format(new Date());
								
								String uploadDirectory = (String)input.get("uploadDirectory");
								String folderName = (String)input.get("folderName");
								String fileName = item.getName();
								String contentType = item.getContentType();
								
								//File DIR
								String fileDir = "";
								String urlDir = "";
								
								File newDir = new File(contextRoot+uploadDirectory);
								if(!newDir.exists()){
									boolean result = newDir.mkdir();
									if(result){
										//success
									}else{
										returnJson.put("status", 0);
										returnJson.put("message", "dir not found!");
										return;
									}
								}
								File newFolder = new File(contextRoot+uploadDirectory+"/"+folderName);
								
								if(!newFolder.exists()){
									boolean result = newFolder.mkdir();
									if(result){
										//success
									}else{
										returnJson.put("status", 0);
										returnJson.put("message", "folder not found!");
										return;
									}
								}
								
								fileDir = contextRoot+uploadDirectory+"/"+folderName+File.separator+folderName+dateString+fileName;
								urlDir = "/Xiaobazaar/"+uploadDirectory+"/"+folderName+File.separator+folderName+dateString+fileName;
								
								boolean correctFileType = false;
								
								if(input.containsKey("fileType")){
									String[] fileTypes = ((String)input.get("fileType")).split(",");
									for(int i = 0; i < fileTypes.length; i++){
										if(contentType.toLowerCase().contains(fileTypes[i])){
											correctFileType = true;
											break;
										}
									}
								}else{
									correctFileType = true;
								}
								
								if(correctFileType){
									InputStream stream = item.openStream();
									
									if(item.isFormField()){
										// Do not process file out put stream
										// it is not a file but a form field
										// this could happen when there is a form within a form
										// I don't know, just guess~~ HA HA!
									}else{
										OutputStream os = new FileOutputStream(new File(fileDir));
										int sizeInt = 0;
										int restrictSize = 2000000;
										
										boolean isTooLarge = false;
										int read = 0;
										byte[] bytes = new byte[1024];
										try{
											while((read = stream.read(bytes))!= -1){
												os.write(bytes, 0, read);
												if(sizeInt > restrictSize){
													// return message file cannot exceed 2Mb!
													isTooLarge = true;
													break;
												}
												sizeInt ++;
											}
											if(isTooLarge){
												// Delete failed file!
												// return exceed 2Mb!
												stream.close();
												os.close();
												File file = new File(fileDir);
												
												if(file.delete()){
													// clear failed file!
													returnJson.put("status", 0);
													returnJson.put("message", "error");
												}else{
													// failed file clear error!
													returnJson.put("status", 0);
													returnJson.put("message", "error");
												}
											}else{
												// success
												String ACCESSKEY = "AKIAIAEQIKWNZUFMWEPA";
												String SECRETKEY = "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";
												String BUKETNAME = "wrpj";
												String S3ROOT = "img";
												String S3URL = "https://s3-ap-southeast-1.amazonaws.com/";
												
												File toS3File = new File(fileDir);
												AWSCredentials credentials = new BasicAWSCredentials(ACCESSKEY, SECRETKEY);
												AmazonS3 s3client = new AmazonS3Client(credentials);
												
												try {
													PutObjectRequest por = new PutObjectRequest(BUKETNAME, S3ROOT+urlDir, toS3File);
													por.withCannedAcl(CannedAccessControlList.PublicRead);
													s3client.putObject(por);
													
													toS3File.delete();
													
													returnJson.put("status", 1);
													//returnJson.put(Key.FILEDIR, fileDir);
													returnJson.put("fileUrl", S3URL + BUKETNAME + "/" + S3ROOT + urlDir);
												} catch (AmazonServiceException ase) {
													returnJson.put("status", 0);
													returnJson.put("message", "error");
													ase.printStackTrace();
												} catch (AmazonClientException ace) {
													returnJson.put("status", 0);
													returnJson.put("message", "error");
													ace.printStackTrace();
												}
											}
										}catch(Exception e){
											returnJson.put("status", 0);
											returnJson.put("message", "error");
											e.printStackTrace();
										}
									}
								}else{
									returnJson.put("status", 0);
									returnJson.put("message", "error");
								}
							}else{
								// handle other form fields
							}
						}catch(Exception e){
							returnJson.put("status", 0);
							returnJson.put("message", "error");
							e.printStackTrace();
						}
					}
				}catch(Exception e){
					returnJson.put("status", 0);
					returnJson.put("message", "error");
					e.printStackTrace();
				}
			}else{
				returnJson.put("status", 0);
				returnJson.put("message", "error");
			}
		}catch(Exception e){
			returnJson.put("status", 0);
			returnJson.put("message", "error");
			e.printStackTrace();
		}
		out.println(returnJson.toJSONString());
	}
}
