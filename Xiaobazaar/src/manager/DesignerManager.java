package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Designer;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class DesignerManager {
	// a. Designer class method: C R U D
	public static ArrayList<Designer> getAllDesigners() {
		ArrayList<Designer> designers = new ArrayList<Designer>();
		DetachedCriteria dc = DetachedCriteria.forClass(Designer.class);
		List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
		for (Object o : list) {
			designers.add((Designer) o);
		}
		return designers;
	}

	public static Designer getDesignerById(long id) {
		return (Designer) HibernateUtil.get(Designer.class, id);
	}

	public static void addDesigner(Designer designer) {
		HibernateUtil.save(designer);
	}

	public static void modifyDesigner(Designer modifiedDesigner) {
		HibernateUtil.update(modifiedDesigner);
	}

	public static void deleteDesigner(Designer Designer) {
		HibernateUtil.delete(Designer);
	}
	
	//method
	public static Designer getDesignerByName(String name){
	Designer designer = null;
		
		DetachedCriteria detachedCriteria = DetachedCriteria.forClass(Designer.class);
		
		List<Object> list = null;
		detachedCriteria.add(Restrictions.eq("name", name));
		list = HibernateUtil.detachedCriteriaReturnList(detachedCriteria);
		
		for(Object o : list){
			designer=(Designer)o;
		}
		return designer;
	}
}
