package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Admin;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class AdminManager {
	// a. Admin class method: C R U D
	public static ArrayList<Admin> getAllAdmins() {
		ArrayList<Admin> admins = new ArrayList<Admin>();
		DetachedCriteria dc = DetachedCriteria.forClass(Admin.class);
		List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
		for (Object o : list) {
			admins.add((Admin) o);
		}
		return admins;
	}

	public static Admin getAdminById(long id) {
		return (Admin) HibernateUtil.get(Admin.class, id);
	}

	public static void addAdmin(Admin admin) {
		HibernateUtil.save(admin);
	}

	public static void modifyAdmin(Admin modifiedAdmin) {
		HibernateUtil.update(modifiedAdmin);
	}

	public static void deleteAdmin(Admin Admin) {
		HibernateUtil.delete(Admin);
	}
	
	//method
	public static Admin getAdminByName(String name){
	Admin admin = null;
		
		DetachedCriteria detachedCriteria = DetachedCriteria.forClass(Admin.class);
		
		List<Object> list = null;
		detachedCriteria.add(Restrictions.eq("name", name));
		list = HibernateUtil.detachedCriteriaReturnList(detachedCriteria);
		
		for(Object o : list){
			admin=(Admin)o;
		}
		return admin;
	}
}
