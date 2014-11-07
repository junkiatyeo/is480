package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Owner;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class OwnerManager {
	// a. Owner class method: C R U D
	public static ArrayList<Owner> getAllOwners() {
		ArrayList<Owner> owners = new ArrayList<Owner>();
		DetachedCriteria dc = DetachedCriteria.forClass(Owner.class);
		List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
		for (Object o : list) {
			owners.add((Owner) o);
		}
		return owners;
	}

	public static Owner getOwnerById(long id) {
		return (Owner) HibernateUtil.get(Owner.class, id);
	}

	public static void addOwner(Owner owner) {
		HibernateUtil.save(owner);
	}

	public static void modifyOwner(Owner modifiedOwner) {
		HibernateUtil.update(modifiedOwner);
	}

	public static void deleteOwner(Owner owner) {
		HibernateUtil.delete(owner);
	}
	
	//method
	public static Owner getOwnerByName(String name){
		Owner owner = null;
		
		DetachedCriteria detachedCriteria = DetachedCriteria.forClass(Owner.class);
		
		List<Object> list = null;
		detachedCriteria.add(Restrictions.eq("name", name));
		list = HibernateUtil.detachedCriteriaReturnList(detachedCriteria);
		
		for(Object o : list){
			owner = (Owner)o;
		}
		return owner;
	}
}
