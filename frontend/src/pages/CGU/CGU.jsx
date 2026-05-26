import { Link } from "react-router-dom";

export default function CGU() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-[#F1F1F1]">
      <h1 className="text-3xl font-bold text-[#E25822] mb-2">
        Conditions générales d'utilisation
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Dernière mise à jour : 18 mars 2026
      </p>

      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            1. Objet
          </h2>
          <p>
            Les présentes conditions générales d'utilisation (CGU) régissent
            l'accès et l'utilisation de la plateforme Bonfire, service de partage
            de publications, de réactions et d'interactions entre utilisateurs.
            En créant un compte ou en vous connectant, vous acceptez sans réserve
            ces conditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            2. Compte utilisateur
          </h2>
          <p>
            Vous vous engagez à fournir des informations exactes lors de votre
            inscription et à maintenir la confidentialité de vos identifiants. Toute
            activité réalisée depuis votre compte est réputée effectuée par vous.
            Bonfire se réserve le droit de suspendre ou supprimer un compte en cas
            de non-respect des présentes CGU.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            3. Contenus publiés
          </h2>
          <p>
            Vous restez responsable des textes, images et commentaires que vous
            publiez. Il est interdit de publier des contenus illicites, diffamatoires,
            haineux, violents ou portant atteinte aux droits de tiers. Bonfire peut
            retirer tout contenu signalé ou manifestement contraire à ces règles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            4. Propriété intellectuelle
          </h2>
          <p>
            Vous conservez la propriété de vos publications. En publiant sur
            Bonfire, vous accordez à la plateforme une licence non exclusive,
            gratuite et mondiale permettant d'afficher, stocker et diffuser vos
            contenus dans le cadre du service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            5. Données personnelles
          </h2>
          <p>
            Les données collectées (email, pseudo, avatar, publications) sont
            utilisées pour le fonctionnement du service. Pour plus d'informations,
            consultez notre politique de confidentialité. Vous pouvez demander la
            suppression de votre compte à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            6. Limitation de responsabilité
          </h2>
          <p>
            Bonfire est fourni « en l'état ». Nous ne garantissons pas une
            disponibilité continue du service et déclinons toute responsabilité
            en cas de perte de données, d'interruption ou de dommages indirects
            liés à l'utilisation de la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            7. Modification des CGU
          </h2>
          <p>
            Bonfire peut modifier ces conditions à tout moment. Les utilisateurs
            seront informés des changements importants. La poursuite de l'utilisation
            du service vaut acceptation des CGU mises à jour.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            8. Contact
          </h2>
          <p>
            Pour toute question relative à ces conditions :{" "}
            <a
              href="mailto:contact@bonfire.app"
              className="text-[#E25822] hover:underline"
            >
              contact@bonfire.app
            </a>
          </p>
        </section>
      </div>

      <Link
        to="/register"
        className="inline-block mt-10 text-[#E25822] hover:underline text-sm"
      >
        ← Retour à l'inscription
      </Link>
    </div>
  );
}
