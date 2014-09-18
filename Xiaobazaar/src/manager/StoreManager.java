package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Store;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class StoreManager {
	// a. Store class method: C R U D
	public static ArrayList<Store> getAllStores() {
		ArrayList<Store> stores = new ArrayList<Store>();
		DetachedCriteria dc = DetachedCriteria.forClass(Store.class);
		List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
		for (Object o : list) {
			stores.add((Store) o);
		}
		return stores;
	}

	public static Store getStoreById(long id) {
		return (Store) HibernateUtil.get(Store.class, id);
	}

	public static void addStore(Store store) {
		HibernateUtil.save(store);
	}

	public static void modifyStore(Store modifiedStore) {
		HibernateUtil.update(modifiedStore);
	}

	public static void deleteStore(Store store) {
		HibernateUtil.delete(store);
	}
	
	//method
	public static Store getStoreByURL(String url){
		Store store = null;
		
		DetachedCriteria detachedCriteria = DetachedCriteria.forClass(Store.class);
		
		List<Object> list = null;
		detachedCriteria.add(Restrictions.eq("url", url));
		list = HibernateUtil.detachedCriteriaReturnList(detachedCriteria);
		
		for(Object o : list){
			store = (Store)o;
			break;
		}
		return store;
	}
}
