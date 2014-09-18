package manager;

import hibernate.HibernateUtil;

import java.util.ArrayList;
import java.util.List;

import model.Theme;

import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;

public class ThemeManager {

	// a. Theme class method: C R U D
		public static ArrayList<Theme> getAllTheme() {
			ArrayList<Theme> themes = new ArrayList<Theme>();
			DetachedCriteria dc = DetachedCriteria.forClass(Theme.class);
			List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
			for (Object o : list) {
				themes.add((Theme) o);
			}
			return themes;
		}

		public static Theme getThemeById(long id) {
			return (Theme) HibernateUtil.get(Theme.class, id);
		}

		public static void addTheme(Theme theme) {
			HibernateUtil.save(theme);
		}

		public static void modifyTheme(Theme modifiedTheme) {
			HibernateUtil.update(modifiedTheme);
		}

		public static void deleteTheme(Theme theme) {
			HibernateUtil.delete(theme);
		}
		
		public static ArrayList<Theme> getThemeByDesignerName(String designerName) {
			ArrayList<Theme> themes = new ArrayList<Theme>();
			DetachedCriteria dc = DetachedCriteria.forClass(Theme.class);
			List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
			for (Object o : list) {
				Theme t = (Theme)o;
				if(t.getDesigner().getName().equals(designerName)){
				themes.add((Theme) o);
				}
			}
			return themes;
		} 
		
		public static ArrayList<Theme> getApprovedThemes() {
			ArrayList<Theme> themes = new ArrayList<Theme>();
			DetachedCriteria dc = DetachedCriteria.forClass(Theme.class);
			
			dc.add(Restrictions.eq("themeStatus", (long)1));
			
			List<Object> list = HibernateUtil.detachedCriteriaReturnList(dc);
			for (Object o : list) {
				themes.add((Theme) o);
			}
			return themes;
		} 
}
